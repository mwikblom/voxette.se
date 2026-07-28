<script setup lang="ts">
import CoverImageComponent from "@/components/CoverImageComponent.vue";
</script>

<template>
  <CoverImageComponent
    src="/images/14-DSC_3937.webp"
    alt="En kvinnokör i jordnära färger och blomkransar i håret som sjunger med inlevelse"
  />
  <div class="container">
    <div class="row">
      <div class="col col-12 col-md-7 col-lg-7">
        <h1 class="display-3">Om föreningen</h1>
        <p>KFUM Voxette är en ideell förening som bedriver damkörsång.</p>
        <p>
          Föreningens ändamål är att bedriva konstnärlig verksamhet i form av körsång via repetitioner och musikaliska
          projekt, exempelvis egna konserter, samproduktioner med andra körer och musiker, körresor samt pro
          bono-sånguppdrag.
        </p>
        <p>
          Körens målsättning är att beröra i ton och närvaro och att musicera på hög nivå utifrån en bred
          repertoarpalett.
        </p>
        <p><b>Org.nr:</b> <br />875003-0796</p>
        <p>
          <b>Postadress: </b>
          <br />
          c/o SARA RÖNNBÄCK,<br />
          Kalle Posts Väg 74,<br />
          702 29 Örebro
        </p>
      </div>
      <div class="col col-12 col-md-5 col-lg-3 offset-lg-2 mt-4">
        <img class="image" alt="Voxette" src="/images/logo.webp" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image {
  width: 100%;
}
</style>
