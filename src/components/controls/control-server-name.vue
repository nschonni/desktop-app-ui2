<template>
  <div class="main">
    <div class="flexColumn">
      <img
        class="pic"
        v-bind:class="{
          flag: isCountryFlagInUse
        }"
        :src="serverImage"
        v-show="isImgLoadError !== true"
        @error="onImgLoadError"
      />
    </div>

    <div
      class="textBloack text"
      v-if="isShowSingleLine"
      v-bind:class="{ text_large: isLargeText, firstLine: !isSingleLine }"
    >
      {{ singleLine }}
    </div>
    <div class="textBloack text" v-else>
      <div class="text firstLine">
        {{ multilineFirstLine }}
      </div>
      <div class="text secondLine">
        {{ multilineSecondLine }}
      </div>
    </div>
  </div>
</template>

<script>
import { PingQuality } from "@/store/types";

import Image_speedometer from "@/assets/speedometer.svg";
import Image_shuffle from "@/assets/shuffle.svg";
import Image_iconStatusGood from "@/assets/iconStatusGood.svg";
import Image_iconStatusModerate from "@/assets/iconStatusModerate.svg";
import Image_iconStatusBad from "@/assets/iconStatusBad.svg";

export default {
  props: {
    server: Object,
    isLargeText: Boolean,

    isSingleLine: Boolean,
    isCountryFirst: Boolean,

    isFullName: String,

    isFastestServer: Boolean,
    isRandomServer: Boolean
  },
  data: () => ({
    isImgLoadError: false
  }),
  computed: {
    isShowSingleLine: function() {
      return (
        this.isSingleLine ||
        this.isFullName ||
        this.isFastestServer ||
        this.isRandomServer
      );
    },

    singleLine: function() {
      if (this.isFastestServer === true) return "Fastest server";
      if (this.isRandomServer === true) return "Random server";
      if (!this.server) return "";
      if (!this.server.city && !this.server.country) return "";
      if (!this.server.city) return this.server.country;

      if (this.isCountryFirst) {
        if (this.isFullName === "true")
          return `${this.server.country}, ${this.server.city}`;
        return `${this.server.country_code}, ${this.server.city}`;
      } else {
        if (this.isFullName === "true")
          return `${this.server.city}, ${this.server.country}`;
        return `${this.server.city}, ${this.server.country_code}`;
      }
    },
    multilineFirstLine: function() {
      if (!this.server) return "";
      if (this.isCountryFirst) return this.server.country;
      return this.server.city;
    },
    multilineSecondLine: function() {
      if (!this.server) return "";
      if (this.isCountryFirst) return this.server.city;
      return this.server.country;
    },
    isCountryFlagInUse: function() {
      return this.isFastestServer !== true && this.isRandomServer !== true;
    },
    serverImage: function() {
      if (this.isFastestServer === true) return Image_speedometer;
      if (this.isRandomServer === true) return Image_shuffle;
      if (!this.server) return `/flags/unk.svg`;
      try {
        const ccode = this.server.country_code.toUpperCase();
        return `/flags/svg/${ccode}.svg`;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    pingStatusImg: function() {
      if (!this.server) return null;
      switch (this.server.pingQuality) {
        case PingQuality.Good:
          return Image_iconStatusGood;
        case PingQuality.Moderate:
          return Image_iconStatusModerate;
        case PingQuality.Bad:
          return Image_iconStatusBad;
      }
      return null;
    }
  },

  methods: {
    onImgLoadError() {
      this.isImgLoadError = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/components/scss/constants";
.main {
  display: flex;
}

img.pic {
  width: 22px;
  margin: 1px;
  margin-top: 2.4px;
}

img.flag {
  //border: 1px solid rgba(var(--flag-border-color-rgb), 0.5);

  //border-radius: 2px;
  box-shadow: 0 0 0.4pt 0.4pt rgba(var(--flag-border-color-rgb), 1);
}

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

div.textBloack {
  font-size: 14px;
  line-height: 20.8px;
  margin-left: 16px;
}

.text_large {
  font-size: 18px;
  line-height: 21px;
  margin-left: 10px;
}

div.firstLine {
  text-align: left;
  font-size: 16px;
}

div.secondLine {
  text-align: left;
  font-size: 12px;
  color: grey;
}

.flexRow {
  display: flex;
  align-items: center;
}

.marginLeft {
  margin-left: 9px;
}

.pingtext {
  color: var(--text-color-details);
}
</style>
