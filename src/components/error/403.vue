<script setup lang="ts">

const router = useRouter()

const emit = defineEmits(['retry'])

const emitRetry = () => {
  emit('retry')
}

</script>

<template>
  <n-result
      class="mt40"
      status="403"
      title="403 禁止访问"
      description="总有些门是对你关闭的"
  >
    <template #footer>
      <n-button @click="emitRetry">放轻松</n-button>
    </template>
  </n-result>
  <div class='hover'>
    <div class='background'>
      <div class='door'>403</div>
      <div class='rug'></div>
    </div>
    <div class='foreground'>
      <div class='bouncer'>
        <div class='head'>
          <div class='neck'></div>
          <div class='eye left'></div>
          <div class='eye right'></div>
          <div class='ear'></div>
        </div>
        <div class='body'></div>
        <div class='arm'></div>
      </div>
      <div class='poles'>
        <div class='pole left'></div>
        <div class='pole right'></div>
        <div class='rope'></div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
$red: #CF352C;
$dark-red: #9C0502;
$light-beige: #F3F2EE;
$beige: #EEE8E0;
$dark-beige: #DAD2C9;
$black: #1D2528;
$gray: #38434A;
$lighter-gray: #49555B;
$white: #FFF;
$bouncer-skin: #FFB482;
$pole: #F5AE4E;
$pole-shadow: #DF9D41;

html, body {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Limelight', cursive;
  color: $gray;
}

.background {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  &::before {
    display: block;
    content: '';
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 450px;
    height: 450px;
    background: $beige;
    border-radius: 50%;
    z-index: -1;
  }
  &::after {
    display: block;
    content: '';
    position: absolute;
    top: -150px;
    left: 50%;
    transform: translateX(-50%);
    width: 550px;
    height: 550px;
    background: $light-beige;
    border-radius: 50%;
    z-index: -2;
  }
}

.door {
  position: relative;
  width: 180px;
  height: 300px;
  margin: 0 auto -10px;
  background: $light-beige;
  border: 10px solid $dark-beige;
  border-radius: 3px;
  font-size: 50px;
  line-height: 3;
  text-align: center;
  text-shadow: 0 2px $pole;
  &::before {
    display: block;
    content: '';
    position: absolute;
    top: 140px;
    right: 10px;
    width: 25px;
    height: 25px;
    background: $black;
    border-radius: 50%;
  }
  &::after {
    display: block;
    content: '';
    position: absolute;
    top: 148px;
    right: 18px;
    width: 35px;
    height: 10px;
    background: $lighter-gray;
    border-radius: 5px;
  }
}

.rug {
  width: 180px;
  border-bottom: 120px solid $red;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  &::before {
    display: block;
    content: '';
    position: relative;
    width: 100%;
    height: 10px;
    background: $dark-red;
  }
}

.foreground {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}

.bouncer {
  position: relative;
  left: -130px;
  transition: left 1.5s;
  .head {
    position: relative;
    left: 10px;
    margin-bottom: 10px;
    width: 65px;
    height: 90px;
    background: $bouncer-skin;
    border-radius: 15px;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    &::before {
      display: block;
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 55px;
      height: 40px;
      background: rgba(0,0,0,.1);
      border-radius: 10px;
      border-top-left-radius: 30px;
      border-bottom-right-radius: 15px;
      z-index: 10;
    }
    .neck {
      position: absolute;
      bottom: -15px;
      width: 48px;
      height: 30px;
      background: $bouncer-skin;
      z-index: 5;
      &::before {
        display: block;
        content: '';
        position: absolute;
        top: 15px;
        right: 0;
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid rgba(0, 0, 0, .3);
        border-top: 2px solid rgba(0, 0, 0, .3);
        border-bottom: 2px solid transparent;
      }
    }
    .eye {
      position: absolute;
      top: 40px;
      width: 5px;
      height: 5px;
      background: $black;
      border-radius: 50%;
      &.left {
        right: 5px;
      }
      &.right {
        right: 30px;
      }
      &::before {
        display: block;
        content: '';
        position: relative;
        bottom: 8px;
        right: 5px;
        width: 15px;
        height: 5px;
        background: rgba(0, 0, 0, .3);
        border-radius: 5px;
        transition: bottom .5s;
      }
    }
    .ear {
      position: relative;
      top: 40px;
      left: -10px;
      width: 20px;
      height: 20px;
      background: $bouncer-skin;
      border-radius: 50%;
      &::before {
        display: block;
        content: '';
        position: relative;
        top: 5px;
        left: 5px;
        width: 10px;
        height: 10px;
        background: $white;
        border-radius: 50%;
      }
      &::after {
        display: block;
        content: '';
        position: relative;
        top: -3px;
        left: 10px;
        width: 10px;
        height: 55px;
        border-top: 3px solid transparent;
        border-left: 2px solid $white;
        border-bottom: 3px solid transparent;
        border-radius: 50%;
        transform: rotate(-10deg);
        z-index: 10;
      }
    }
  }
  .body {
    position: relative;
    width: 110px;
    height: 270px;
    background: $black;
    border-top-right-radius: 45px;
    border-top-left-radius: 15px;
    &::before {
      display: block;
      content: '';
      position: relative;
      top: 5px;
      width: 104px;
      height: 110px;
      background: $white;
      border-top-right-radius: 42px;
    }
    &::after {
      display: block;
      content: '';
      position: absolute;
      top: 0;
      width: 75px;
      height: 180px;
      background: $gray;
      border-top-right-radius: 42px;
      border-top-left-radius: 15px;
      border-bottom-right-radius: 100px;
      border-bottom-left-radius: 10px;
      z-index: 15;
    }
  }
  .arm {
    position: absolute;
    top: 105px;
    left: -20px;
    width: 60px;
    height: 230px;
    background: $lighter-gray;
    border-radius: 30px;
    box-shadow: -1px 0px $black;
    transform: rotate(-30deg);
    transform-origin: top center;
    z-index: 20;
    transition: transform 1s;
    &::before {
      display: block;
      content: '';
      position: absolute;
      bottom: 0;
      width: 60px;
      height: 60px;
      background: $bouncer-skin;
      border-radius: 50%;
    }
  }
}

.poles {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-25%);
  .pole {
    position: absolute;
    bottom: 0;
    width: 15px;
    height: 135px;
    background: $pole;
    &.left {
      left: 200px;
    }
    &.right {
      right: 200px;
    }
    &::before {
      display: block;
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 25px;
      height: 25px;
      background: $pole;
      border-radius: 50%;
      box-shadow: inset 0 -2px $pole-shadow;
    }
    &::after {
      display: block;
      content: '';
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 25px;
      height: 4px;
      background: $pole;
      border-radius: 4px;
      box-shadow: 0 2px $pole-shadow;
    }
  }
  .rope {
    position: absolute;
    top: -110px;
    left: -218px;
    width: 150px;
    height: 75px;
    border: 20px solid $red;
    border-top: 0;
    border-bottom-left-radius: 150px;
    border-bottom-right-radius: 150px;
    box-shadow: 0 2px $dark-red;
    box-sizing: border-box;
    transition: width 1.5s;
  }
}

.hover:hover {
  .bouncer {
    left: 130px;
  }
  .arm {
    transform: rotate(-42deg);
  }
  .rope {
    width: 435px;
  }
  .eye::before {
    bottom: 4px;
  }
}
</style>