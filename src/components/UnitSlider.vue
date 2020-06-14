<template>
  <div
    ref="slider"
    :class="$style.main"
  >
    <div
      :class="$style.value"
    >
      <span
        :class="$style.edge"
      >
        {{ from }}
      </span>
      <span
        :class="$style.current"
      >
        {{ local }}
      </span>
      <span
        :class="$style.edge"
      >
        {{ to }}
      </span>
      <div
        :class="$style.point"
        :style="style"
        @mousedown="activateDrag"
        @touchstart="activateDrag"
      />
    </div>
    <div
      :class="$style.label"
      @mousedown="activateDrag"
      @touchstart="activateDrag"
    >
      <div
        :class="$style.word"
      >
        {{ label.split(' ')[0] }}
      </div>
      <div
        :class="$style.word"
      >
        {{ label.split(' ')[1] }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    from: {
      type: Number,
      required: true
    },
    to: {
      type: Number,
      required: true
    },
    step: {
      type: Number,
      default: 0
    },
    live: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isDown: false,
      local: 0,
      slider: {
        left: 0,
        width: 0
      }
    }
  },
  computed: {
    style () {
      return {
        left: 100 * (this.from - this.local) / (this.from - this.to) + '%'
      }
    },
    parts () {
      return (this.to - this.from) / this.step
    }
  },
  beforeMount () {
    document.body.addEventListener('mouseup', this.deactivateDrag)
    document.body.addEventListener('mousemove', this.dragPoint)
    document.body.addEventListener('touchend', this.deactivateDrag)
    document.body.addEventListener('touchmove', this.dragPoint)
    document.body.addEventListener('mouseleave', this.deactivateDrag)
    window.addEventListener('resize', this.setSliderElement)
    this.local = this.value
  },
  mounted () {
    this.setSliderElement()
  },
  beforeDestroy () {
    document.body.removeEventListener('mouseup', this.deactivateDrag)
    document.body.removeEventListener('mousemove', this.dragPoint)
    document.body.removeEventListener('touchend', this.deactivateDrag)
    document.body.removeEventListener('touchmove', this.dragPoint)
    document.body.removeEventListener('mouseleave', this.deactivateDrag)
    window.removeEventListener('resize', this.setSliderElement)
  },
  methods: {
    setSliderElement () {
      const data = this.$refs.slider.getBoundingClientRect()
      this.slider.left = data.left
      this.slider.width = data.width
    },
    dragPoint (event) {
      let clientX = 0
      if (event.type === 'mousemove') {
        clientX = event.clientX
      } else if (event.type === 'touchmove') {
        clientX = event.touches[0].clientX
      }
      if (this.isDown) {
        const position = clientX - this.slider.left
        const delta = this.to - this.from

        let value = Math.round(delta * position / this.slider.width + this.from)

        if (value > this.to) {
          value = this.to
        } else if (value < this.from) {
          value = this.from
        }

        this.local = this.step ? Math.round(value / this.step) * this.step : value

        if (this.live) this.$emit('input', this.local)
      }
    },
    deactivateDrag (event) {
      this.$emit('input', this.local)
      this.isDown = false
    },
    activateDrag (event) {
      this.isDown = true
    }
  }
}
</script>
<style module>
  :root {
    --grisaille: #57606f;
    --twinkle: #ced6e0;
  }

  .main {
    text-align: center;
    user-select: none;
  }

  .label {
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    color: var(--grisaille);
  }

  .word {
    display: inline;

    @media (width < 600px) {
      display: block;
    }
  }

  .point {
    position: absolute;
    top: 50%;
    width: 13px;
    height: 13px;
    border: 1px solid var(--grisaille);
    border-radius: 100%;
    background: white;
    transform: translateY(9px) translateX(-50%);
    cursor: pointer;
    user-select: none;
  }

  .value {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--twinkle);
    margin-bottom: 12px;
    line-height: 18px;

    @media (width < 600px) {
      justify-content: center;
    }
  }

  .current {
    font-size: 18px;
    color: var(--grisaille);
  }

  .edge {
    font-size: 14px;
    color: var(--twinkle);

    @media (width < 600px) {
      display: none;
    }
  }

</style>
