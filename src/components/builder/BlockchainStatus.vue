<script setup lang="ts">
import TransactionsMin from './TransactionsMin.vue';
import BriqDetails from './BriqDetails.vue';
import BriqListModal from './modals/BriqListModal.vue';
import Hotkey from '../generic/Hotkey.vue';
</script>

<template>
    <div class="flex flex-col items-end">
        <Hotkey name="briqListModal" :data="{ key: 'b', ctrl: true }" :handler="() => pushModal(BriqListModal)"/>
        <div class="overflow-auto flex flex-nowrap flex-col justify-start content-end">
            <Btn class="pointer-events-auto flex items-center gap-2 text-center" @click="mainBtnClick" :tooltip="mainBtnTooltip">
                <div v-if="!isConnected">Connect wallet</div>
                <div v-else-if="isConnected && contractStore.briq" class="inline-block text-sm leading-3">{{ userAddress }}<br/>{{ userNet }}</div>
                <div v-else="" class="inline-block text-sm leading-3">Unsupported<br/>network</div>
                <template v-if="isConnected && contractStore.briq">
                    <i v-if="transactionsManager.anyPending() || chainBriqs.fetchingBriqs" class="fas fa-spinner animate-spin-slow"></i>
                    <i v-if="!transactionsManager.anyPending() && !chainBriqs.fetchingBriqs && chainBriqs.getNbBriqs() > 0" class="fas fa-check"></i>
                </template>
            </Btn>
            <div :class="'my-2 ' + (expanded ? 'pointer-events-auto': 'hidden')">
                <div class="flex flex-col flex-nowrap gap-1">
                    <Btn v-if="isConnected" @click="expanded = false; wallet.disconnect()">Disconnect</Btn>
                </div>
            </div>
        </div>
        <div :class="'relative bg-base rounded-md ' + (expanded ? 'pointer-events-auto' : 'hidden')">
            <BriqDetails/>
        </div>
        <div :class="'my-2 relative bg-base rounded-md ' + (expanded ? 'pointer-events-auto' : 'hidden')">
            <TransactionsMin/>
        </div>
    </div>
</template>

<script lang="ts">
import contractStore from '@/chain/Contracts';
import { pushModal } from '../Modals.vue';
import { walletStore2 } from '@/chain/Wallet';

import WalletSelectorVue from '../WalletSelector.vue';
import { transactionsManager } from '../../builder/Transactions';
import { defineComponent } from 'vue';
export default defineComponent({
    data() {
        return {
            expanded: false,
            wallet: walletStore2,
            builderData: this.$store.state.builderData,
            contractStore: contractStore,
            transactionsManager
        };
    },
    inject: ["messages", "chainBriqs"],
    computed: {
        isConnected() {
            return this.wallet.userWalletAddress;
        },
        mainBtnTooltip() {
            if (this.isConnected)
                return "Click here for more details on blockchain status";
            return "Click here to connect your wallet";
        },
        userAddress() {
            return this.wallet.userWalletAddress.substr(0, 5) + '...' + this.wallet.userWalletAddress.substr(-5, 5);
        },
        userNet() {
            return this.wallet.signer.baseUrl.search("mainnet") !== -1 ? 'mainnet' : 'testnet';
        }
    },
    methods: {
        pushModal,
        mainBtnClick() {
            if (this.isConnected)
                this.expanded = ! this.expanded;
            else
                pushModal(WalletSelectorVue);
        },
    }
});
</script>

<style scoped>
</style>
