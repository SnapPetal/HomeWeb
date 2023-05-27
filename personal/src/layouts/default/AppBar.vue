<template>
  <div>
    <v-app-bar app color="primary" dark fixed>
      <v-toolbar-title>
        <span class="headline">Thon Becker</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon href="https://www.linkedin.com/in/thon-becker-66600947/" target="_blank">
        <v-icon>mdi-linkedin</v-icon>
      </v-btn>
      <v-btn icon href="https://github.com/SnapPetal/" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn icon href="https://www.facebook.com/profile.php?id=100014388064515" target="_blank">
        <v-icon>mdi-facebook</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-parallax src="https://via.placeholder.com/1920x600" height="600">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="display-1">Hi, I'm Thon Becker</h1>
          <p class="subheading">I'm a Software Engineer that welcomes challenges and architects solutions.</p>
        </v-layout>
      </v-parallax>
    </v-content>
  </div>
</template>

<script setup>
//
</script>
