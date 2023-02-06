<template>
  <div>
    <div>
      <h1 class="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
        Bucket <span class="text-blue-600 dark:text-blue-500">{{ route.params.bucketAddress }}</span></h1>
      <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Balance:
        {{ bucketBalance / 1000000000000000000 }} FIL
        <button
            v-on:click="()=>topUpBucketBalance()"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          + 1FIL
        </button>

      </p>

      <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Tip amount:
        {{ tip / 1000000000000000000 }} FIL / GiB

      </p>

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
            {{ object.filename }}
          </th>
          <td class="px-6 py-4">
            {{ object.ipfsCid }}
          </td>
          <td class="px-6 py-4">
            {{ object.filesize }}
          </td>
          <td class="px-6 py-4">
            {{ object.providers.join(', ') }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="userAddress.value===ownerAddress.value" class="mt-16">
      <h2 class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Add object</h2>

      <div>
        <div class="mb-6">
          <label class="block mb-2 text-md font-medium text-gray-900 dark:text-white">CID</label>
          <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required v-model="newIpfsCid">
        </div>
        <div class="mb-6">
          <label class="block mb-2 text-md font-medium text-gray-900 dark:text-white">Filesize</label>
          <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required v-model="newFilesize">
        </div>
        <div class="mb-6">
          <label class="block mb-2 text-md font-medium text-gray-900 dark:text-white">Original Url</label>
          <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required v-model="newOriginalUrl">
        </div>
        <div class="mb-6">
          <label class="block mb-2 text-md font-medium text-gray-900 dark:text-white">Filename</label>
          <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required v-model="newFilename">
        </div>
        <div class="flex items-start mb-6">
          <div class="flex items-center h-5">
            <input id="iscar" type="checkbox" v-model="newIsCar"
                   class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                   required>
          </div>
          <label for="iscar" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is Car?</label>
        </div>
        <button type="submit" v-on:click="()=>addObject()"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Add object
        </button>
      </div>
    </div>
    <div class="mt-16">
      <h2 class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Verify Deal</h2>

      <div>
        <div class="mb-6">
          <label class="block mb-2 text-md font-medium text-gray-900 dark:text-white">DEAL ID</label>
          <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required v-model="dealId">
        </div>
        <button type="submit" v-on:click="()=>verifyDeal()"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Verify deal
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import CID from 'cids'

const route = useRoute()

import Web3 from 'web3'
import {CONTRACT_JSON} from '../../config'

const instance = ref(null)
const userAddress = ref('00')
const ownerAddress = ref('0')
const bucketBalance = ref(0)

const replicasNumber = ref(0)
const tip = ref(0)


const bucketAddress = ref()
const objects = ref([])


//new object fields
const newIpfsCid = ref()
const newFilesize = ref()
const newIsCar = ref(false)
const newOriginalUrl = ref()
const newFilename = ref()


const dealId = ref(0)

const initWeb3 = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Ask to connect
      await window.ethereum.send('eth_requestAccounts');
      instance.value = new Web3(window.ethereum)
      // Get necessary info on your node
      const networkId = await instance.value.eth.net.getId();
      const coinbase = await instance.value.eth.getCoinbase();
      const balance = await instance.value.eth.getBalance(coinbase)
      userAddress.value = coinbase
      console.log({
        networkId,
        coinbase,
        balance
      })

      await fetchData()
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

const fetchData = async () => {
  let contract = new instance.value.eth.Contract(CONTRACT_JSON, bucketAddress.value)
  const balance = await instance.value.eth.getBalance(bucketAddress.value)
  const owner = await contract.methods.owner().call({from: userAddress.value})
  const tipPerGib = await contract.methods.tip().call({from: userAddress.value})
  tip.value = tipPerGib

  const replicas = await contract.methods.replicasNumber.call({from: userAddress.value})
  replicasNumber.value = replicas
  ownerAddress.value = owner
  bucketBalance.value = balance
  let objectsParsed = false
  let objectI = 0
  objects.value = []
  while (!objectsParsed) {
    try {
      const cidHex = await contract.methods.objectsList(objectI).call({from: userAddress.value})
      const cid = new CID('f' + cidHex.substring(4)).toString('base32')
      let object = await contract.methods.objects(cidHex).call({from: userAddress.value})
      let activeProviders = await contract.methods.getActiveProviders(cidHex).call({from: userAddress.value})
      let providers = []
      for (const activeProvider of activeProviders) {
        if (activeProvider == '0') {
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

}

const topUpBucketBalance = async () => {
  await instance.value.eth.sendTransaction({
    from: userAddress.value,
    to: bucketAddress.value,
    value: 1000000000000000000
  })
  await fetchData()
}

const verifyDeal = async () => {
  console.log('Verify deal', dealId.value)
  let contract = new instance.value.eth.Contract(CONTRACT_JSON, bucketAddress.value)
  await contract.methods.verifyDeal(dealId.value).send({from: userAddress.value})
  await fetchData()

}

const addObject = async () => {
  console.log(newIpfsCid.value, newFilesize.value, newIsCar.value, newOriginalUrl.value, newFilename.value)

  const cidHexRaw = new CID(newIpfsCid.value).toString('base16').substring(1)
  const cidHex = "0x00" + cidHexRaw

  let contract = new instance.value.eth.Contract(CONTRACT_JSON, bucketAddress.value)
  await contract.methods.addObject(cidHex, newFilesize.value, newIsCar.value, newOriginalUrl.value, newFilename.value).send({from: userAddress.value})
  await fetchData()
}

onMounted(() => {
  bucketAddress.value = route.params.bucketAddress
  initWeb3()
})

</script>
