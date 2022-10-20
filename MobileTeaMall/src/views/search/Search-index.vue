<template>
    <div class="search-index">
        <Header></Header>
        <section>
            <History></History>
        </section>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue';
import Header from '@/components/search/Header.vue';
import History from '@/components/search/History.vue';

export default {
    name: "Search-index",
    components: { Tabbar, Header, History }
}
</script>

<style scoped>
.search-index {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
}

section {
    flex: 1;
    overflow: hidden;
    background-color: #f5f5f5;
}
</style>