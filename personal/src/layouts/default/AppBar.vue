<template>
  <div>
    <v-app-bar app color="primary" light fixed>
      <v-toolbar-title>
        <span class="headline">Thon Becker</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="secondary" icon href="https://www.linkedin.com/in/thon-becker-66600947/" target="_blank">
        <v-icon>mdi-linkedin</v-icon>
      </v-btn>
      <v-btn color="secondary" icon href="https://github.com/SnapPetal/" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn color="secondary" icon href="https://www.facebook.com/profile.php?id=100014388064515" target="_blank">
        <v-icon>mdi-facebook</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-parallax src="@/assets/hero_background.png" height="600">
        <div class="parallax-overlay">
          <v-container class="d-flex justify-center align-center">
            <v-layout class="hero-banner">
              <h1 class="hero-heading">Hi, I'm Thon Becker</h1>
              <p class="hero-subheading">I'm a Software Engineer that welcomes challenges and architects solutions.</p>
            </v-layout>
          </v-container>
        </div>
        <v-layout class="d-flex justify-center align-center">

        </v-layout>
      </v-parallax>
    </v-content>
  </div>
</template>

<script setup>
//
</script>
