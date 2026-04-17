<script setup lang="ts"></script>

<template>
  <div class="cover-image-container">
    <img
      class="cover-image"
      src="/images/14-DSC_3937.webp"
      alt="En kvinnokör i jordnära färger och blomkransar i håret som sjunger med inlevelse"
    />
  </div>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col col-12 col-lg-7">
        <h1 class="display-3">Damkören Voxette</h1>
        <p class="lead">Vi är kvinnor. Vi är döttrar. Vi är systrar. Vi är mammor. Väninnor. Sångerskor.</p>
        <p>
          Vi bjuder på stor variation i musik, genrer och budskap. Från den ensammaste tonen, över jordens stormande
          natt och genom himlarymderna. Från en ömsint smekning till en kaxig örfil. Från oro, sånglöshet och trötthet
          till jubel, glädje och ett modigt vrål.
        </p>
        <p>
          Vi sjunger barfota, i höga klackar och med ljus i hår. Vi sjunger om kärlek, julefrid, skyfall och solsken. Vi
          sjunger starkt, vi sjunger ljuvt. Vårt budskap är lika lyxigt, lättsamt, svårmodigt, brokigt, färgstarkt och
          mångfacetterat som vi. Vi kommer aldrig att tystna.
        </p>
      </div>
      <div class="col col-12 col-sm-10 col-md-8 col-lg-5">
        <img src="/images/logo.webp" alt="Logga" class="logo" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";

.cover-image-container {
  background: $black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  object-fit: cover;
  object-position: 0 40%;
  aspect-ratio: 3/1;
  max-height: 20rem;
}

.logo {
  width: calc(100% - (2rem * 2));
  max-width: 380px;
  margin: 3rem 2rem 2rem 2rem;
}
</style>
