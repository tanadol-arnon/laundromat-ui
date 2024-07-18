<template>
  <v-container>
    <v-row class="h-screen">
      <v-col class="d-flex align-self-center">
        <div class="d-flex flex-column ga-5 mx-auto text-center">
          <h1 class="text-h1 font-weight-black text-primary text-error-code">
            404
          </h1>
  
          <h1 class="text-h5 font-weight-bold text-primary">
            ไม่พบหน้าที่คุณกำลังค้นหา
          </h1>
  
          <v-btn
            text="กลับหน้าหลัก"
            class="py-3"
            height="50"
            color="primary"
            size="large"
            variant="elevated"
            rounded="lg"
            href="/"
            />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup></script>

<style>
.text-error-code {
  font-size: 10rem !important;
}
.text-error-desc {
  font-size: 100px !important;
}
</style>
