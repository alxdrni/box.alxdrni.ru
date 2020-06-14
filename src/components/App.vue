<template>
  <div
    id="app"
    :class="$style.block"
  >
    <div
      :class="$style.top"
    >
      <div
        :class="$style.wrap"
      >
        <div
          :class="$style.list"
        >
          <check-box
            v-if="false"
            :active="liveUpdate"
            text="Live Update (slow)"
            @click="liveUpdate = !liveUpdate"
          />
          <check-box
            :active="rotateModel"
            text="Auto Rotate Model"
            @click="rotateModel = !rotateModel"
          />
          <check-box
            :active="scalePattern"
            text="Auto Scale Pattern"
            @click="scalePattern = !scalePattern"
          />
        </div>
        <main-button
          text="Download Pattern"
          @click="downloadTemplate"
        />
      </div>
    </div>
    <div
      id="main"
      :class="$style.main"
    >
      <box-pattern
        :width="width"
        :depth="depth"
        :height="height"
        :thick="thick"
        :hole="hole"
        :circle="circle"
        :clip="clip"
        :scale="scalePattern"
      />
      <box-model
        :width="width"
        :depth="depth"
        :height="height"
        :thick="thick"
        :hole="hole"
        :circle="circle"
        :clip="clip"
        :rotate="rotateModel"
      />
    </div>
    <div
      :class="$style.bottom"
    >
      <unit-slider
        v-model.number="width"
        :class="$style.unitSlider"
        :from="200"
        :to="600"
        :step="10"
        :live="liveUpdate"
        label="Box width"
      />
      <unit-slider
        v-model.number="depth"
        :class="$style.unitSlider"
        :from="200"
        :to="400"
        :step="10"
        :live="liveUpdate"
        label="Box depth"
      />
      <unit-slider
        v-model.number="height"
        :class="$style.unitSlider"
        :from="100"
        :to="300"
        :step="10"
        :live="liveUpdate"
        label="Box height"
      />
      <unit-slider
        v-model.number="thick"
        :class="$style.unitSlider"
        :from="1"
        :to="5"
        :step="1"
        :live="liveUpdate"
        label="Paper caliper"
      />
    </div>
  </div>
</template>
<script>
import BoxPattern from './BoxPattern.vue'
import BoxModel from './BoxModel.vue'
import UnitSlider from './UnitSlider.vue'
import CheckBox from './CheckBox.vue'
import MainButton from './MainButton.vue'

export default {
  name: 'BoxPage',
  components: {
    BoxPattern,
    BoxModel,
    UnitSlider,
    CheckBox,
    MainButton
  },
  data () {
    return {
      width: 400,
      height: 200,
      depth: 300,
      thick: 3,
      hole: {
        long: 100,
        short: 30
      },
      circle: {
        radius: 15
      },
      scalePattern: true,
      rotateModel: true,
      liveUpdate: false,
      view: 'template'
    }
  },
  computed: {
    clip () {
      const widthRatio = Math.floor(this.width * 0.01)
      const widthHight = (this.width - this.thick * 6) / (1.5 * (widthRatio + 1) + widthRatio)
      const widthLow = widthHight * 1.5

      const depthRatio = Math.floor(this.depth * 0.01)
      const depthHight = this.depth / (1.5 * (depthRatio + 1) + depthRatio)
      const depthLow = depthHight * 1.5

      return {
        width: {
          ratio: widthRatio,
          high: widthHight,
          low: widthLow
        },
        depth: {
          ratio: depthRatio,
          high: depthHight,
          low: depthLow
        }
      }
    }
  },
  methods: {
    selectView (view) {
      this.view = view
    },
    downloadTemplate () {
      const svgData = document.querySelector('#template').outerHTML
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      const downloadLink = document.createElement('a')
      downloadLink.href = svgUrl
      downloadLink.download = 'template.svg'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }
}
</script>
<style module>
:root {
  --leftPanelWidth: 150px;
  --rightPanelWidth: 150px;
  --topPanelHeight: 150px;
  --bottomPanelHeight: 150px;
  --grisaille: #57606f;
  --twinkle: #ced6e0;
}

.block {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top {
  composes: panel;
  padding: 20px 60px;
  box-shadow: 0 0 80px -20px rgba(87, 96, 111, 0.3);

  @media (width < 600px) {
    padding-right: 30px;
    padding-left: 30px;
  }
}

.wrap {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 980px;
}

.list {
  display: flex;
  flex: 1;
}

.bottom {
  composes: panel;
  padding: 30px;
  box-shadow: 0 0 80px -20px rgba(87, 96, 111, 0.3);

  @media (width < 600px) {
    padding: 15px;
  }
}

.main {
  composes: panel;
  position: relative;
  display: flex;
  flex: 1;
}

.part {
  display: block;
  height: 100%;
}

.left {
  composes: part;
}

.right {
  composes: part;
}

.central {
  composes: part;
  position: relative;
  flex: 1;
}

.unitSlider {
  flex-shrink: 1;
  width: 25%;
  max-width: 200px;
  margin: 0 30px;

  @media (width < 600px) {
    margin: 0 15px;
  }
}
</style>
