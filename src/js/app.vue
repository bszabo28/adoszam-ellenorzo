<template>
        <div>
                <header>
                        <div class="container">
                                <div class="col-xs-12">
                                        <h3 :class="{'left-aligned': getTaxnumbers.length}">
                                                Adószám ellenőrző
                                        </h3>
                                </div>
                        </div>
                </header>
                <main class="container">
                        <!--<div class="row">
                                <div class="col-xs-12 col-md-4">
                                        <stat-general-component></stat-general-component>
                                </div>
                        </div>-->
                        <div class="row">
                                <div :class="{
                                        'col-xs-12': true, 
                                        'col-md-4': getTaxnumbers.length, 
                                        'col-md-12': !getTaxnumbers.length
                                }">
                                        <taxnumber-component></taxnumber-component>
                                        <info-component></info-component>
                                </div>

                                <div class="col-xs-12 col-md-8">
                                        <table-component></table-component>
                                </div>
                        </div>

                        <div class="jumbotron" v-show="!getTaxnumbers.length && !getTaxnumber">
                                <p>
                                        Ezen az oldalon leellenőrizheted egy magyar adószám formai érvényességét, vagy készíthetsz egy formailag érvényes adószámot.
                                        Kiolvashatod annak alapadatait - áfakör, regionális adóhatóság -, vagy megtudhatod az okát az miért
                                        nem érvényes. Az adószám ellenőrző kódját megtalálod a
                                        <a target="_blank"
                                                href="https://github.com/bszabo28/adoszam-ellenorzo">githubon</a>!
                                </p>
                        </div>
                </main>
        </div>
</template>
<script>
        import { mapGetters } from 'vuex';

        // Adószám ellenörző komponens
        import Taxnumber from './components/taxnumber.vue';

        // Beírt adószám hibái, adatai
        import Info from './components/info.vue';

        // Táblázat
        import Table from './components/table.vue';

        // Statisztika
        // import StatGeneral from './components/stat-general.vue';    

        // Vue.component('info2-component',Info);    

        export default {

                components: {
                        'info-component': Info,
                        'table-component': Table,
                        'taxnumber-component': Taxnumber,
                        //'stat-general-component': StatGeneral,
                },

                computed: {
                        ...mapGetters(['getTaxnumbers','getTaxnumber']),
                }
        };

</script>