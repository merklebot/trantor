<template>
  <div>
    <div>
      <h1 class="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
        Bucket <span class="text-blue-600 dark:text-blue-500">{{ route.params.bucketAddress }}</span></h1>
      <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Some info about bucket</p>
    </div>
    <div class="relative overflow-x-auto pt-16">
      <h2 class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Objects:</h2>

      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Filename
          </th>
          <th scope="col" class="px-6 py-3">
            Cid
          </th>
          <th scope="col" class="px-6 py-3">
            Filesize
          </th>
          <th scope="col" class="px-6 py-3">
            Providers
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="object in objects" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{object.filename}}
          </th>
          <td class="px-6 py-4">
            {{object.ipfsCid}}
          </td>
          <td class="px-6 py-4">
            {{object.filesize}}
          </td>
          <td class="px-6 py-4">
            {{object.providers.join(', ')}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import CID from 'cids'

const route = useRoute()

import Web3 from 'web3'
import {CONTRACT_JSON} from '../../config'

const bucketAddress = ref()
const objects = ref([])
const initWeb3 = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Ask to connect
      await window.ethereum.send('eth_requestAccounts');
      const instance = new Web3(window.ethereum)
      // Get necessary info on your node
      const networkId = await instance.eth.net.getId();
      const coinbase = await instance.eth.getCoinbase();
      const balance = await instance.eth.getBalance(coinbase)
      console.log({
        networkId,
        coinbase,
        balance
      })
      let contract = new instance.eth.Contract(CONTRACT_JSON, bucketAddress.value)
      let objectsParsed = false
      let objectI = 0
      while (!objectsParsed) {
        try {
          const cidHex = await contract.methods.objectsList(objectI).call({from: coinbase})
          const cid = new CID('f' + cidHex.substring(4)).toString('base32')
          let object = await contract.methods.objects(cidHex).call({from: coinbase})
          let activeProviders = await contract.methods.getActiveProviders(cidHex).call({from: coinbase})
          let providers = []
          for (const activeProvider of activeProviders) {
            if(activeProvider =='0'){
              continue
            }
            providers.push(`f0${activeProvider}`)
          }
          object['ipfsCid'] = cid
          object['providers'] = providers
          console.log(object)
          objects.value.push(object)
          objectI += 1
        } catch (e) {
          console.log(e)
          objectsParsed = true
        }
      }
    } catch (error) {
      // User denied account access
      console.error('User denied web3 access', error);
      return;
    }
  }
  // No web3 provider
  else {
    console.error('No web3 provider detected');
    return;
  }
}

onMounted(() => {
  bucketAddress.value = route.params.bucketAddress
  initWeb3()
})

</script>
