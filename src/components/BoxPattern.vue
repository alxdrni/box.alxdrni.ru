<template>
  <svg
    id="template"
    :viewBox="viewBox"
    :class="$style.svg"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      v-if="show"
      :transform="transform"
    >
      <template
        v-for="i in [0, 1]"
      >
        <g
          :key="'group-' + i"
          :transform="`rotate(${i * 180} ${i * (svg.width / 2)} ${i * (svg.height / 2)})`"
        >
          <g
            name="fold"
          >
            <path
              :name="`f1-${i}`"
              :d="`M${thick + height} ${offset.top} v ${depth}`"
            />
            <path
              :name="`f2-${i}`"
              :d="`M${thick * 4 + height} ${offset.top} v ${depth}`"
            />
            <path
              :name="`f3-${i}`"
              :d="`M${thick * 4 + height * 2} ${offset.top} v ${depth}`"
            />
            <path
              :name="`f4-${i}`"
              :d="`M${offset.left + thick * 3 } ${thick + height} h ${width - thick * 6}`"
            />
            <path
              :name="`f5-${i}`"
              :d="`M${offset.left + thick * 3 } ${thick * 3 + height} h ${width - thick * 6}`"
            />
            <path
              :name="`f6-${i}`"
              :d="`M${offset.left + thick } ${thick * 3 + height * 2} h ${width - thick * 2}`"
            />
            <path
              :name="`f7-${i}`"
              :d="`M${offset.left + thick} ${height + thick * 3} v ${height}`"
            />
            <path
              :name="`f8-${i}`"
              :d="`M${offset.left + thick} ${height * 3 + depth + thick * 3} v ${-height}`"
            />
          </g>
          <g
            name="cut"
          >
            <template
              v-for="r in clip.depth.ratio"
            >
              <path
                :key="`c01-1-${i}-${r}`"
                :name="`c01-1-${i}-${r}`"
                :d="`M${thick} ${offset.top + (r - 1) * (clip.depth.high + clip.depth.low)} v ${clip.depth.low} h ${-thick} v ${clip.depth.high} h ${thick} ${r == clip.depth.ratio ? 'v ' + clip.depth.low : ''}`"
              />
              <path
                :key="`c01-2-${i}-${r}`"
                :name="`c01-2-${i}-${r}`"
                :d="`M${offset.left + thick * 2} ${offset.top + r * clip.depth.low + (r - 1) * clip.depth.high} v ${clip.depth.high} h ${thick} v ${-clip.depth.high} h ${-thick}`"
              />
              <path
                :key="`c01-3-${i}-${r}`"
                :name="`c01-3-${i}-${r}`"
                :d="`M${height + thick * 2} ${offset.top + r * clip.depth.low + (r - 1) * clip.depth.high} v ${clip.depth.high} h ${thick} v ${-clip.depth.high} h ${-thick}`"
              />
            </template>
            <template
              v-for="r in Math.ceil(clip.depth.ratio / 2)"
            >
              <path
                v-if="isOdd(clip.depth.ratio)"
                :key="`c01-4-${i}-${r}`"
                :name="`c01-4-${i}-${r}`"
                :d="`M${offset.left + thick - (r - 1) * (clip.depth.high + clip.depth.low)} ${height + thick * 3} h ${-clip.depth.low} v ${-thick} h ${r == Math.ceil(clip.depth.ratio / 2) ? -clip.depth.high / 2 : -clip.depth.high} v ${thick}`"
              />
              <path
                v-if="!isOdd(clip.depth.ratio)"
                :key="`c01-5-${i}-${r}`"
                :name="`c01-5-${i}-${r}`"
                :d="`M${offset.left + thick - (r - 1) * (clip.depth.high + clip.depth.low)} ${height + thick * 3} h ${-clip.depth.low} v ${-thick} h ${-clip.depth.high} v ${thick} ${r == Math.ceil(clip.depth.ratio / 2) ? 'h' + -clip.depth.low / 2 : ''}`"
              />
              <path
                v-if="isOdd(clip.depth.ratio)"
                :key="`c01-6-${i}-${r}`"
                :name="`c01-6-${i}-${r}`"
                :d="`M${offset.left + thick - (r - 1) * (clip.depth.high + clip.depth.low)} ${offset.top + height + depth} h ${-clip.depth.low} v ${thick} h ${r == Math.ceil(clip.depth.ratio / 2) ? -clip.depth.high / 2 : -clip.depth.high} v ${-thick}`"
              />
              <path
                v-if="!isOdd(clip.depth.ratio)"
                :key="`c01-7-${i}-${r}`"
                :name="`c01-7-${i}-${r}`"
                :d="`M${offset.left + thick - (r - 1) * (clip.depth.high + clip.depth.low)} ${offset.top + height + depth} h ${-clip.depth.low} v ${thick} h ${-clip.depth.high} v ${-thick} ${r == Math.ceil(clip.depth.ratio / 2) ? 'h' + -clip.depth.low / 2 : ''}`"
              />
            </template>
            <template
              v-for="r in clip.width.ratio"
            >
              <path
                :key="`c02-1-${i}-${r}`"
                :name="`c02-1-${i}-${r}`"
                :d="`M${offset.left + thick * 3 + (r - 1) * (clip.width.high + clip.width.low)} ${thick} h ${clip.width.low} v ${-thick} h ${clip.width.high} v ${thick} ${r == clip.width.ratio ? 'h ' + clip.width.low : ''}`"
              />
              <path
                :key="`c02-2-${i}-${r}`"
                :name="`c02-2-${i}-${r}`"
                :d="`M${offset.left + thick * 3 + r * clip.width.low + (r - 1) * clip.width.high} ${offset.top + thick} h ${clip.width.high} v ${thick} h ${-clip.width.high} v ${-thick}`"
              />
            </template>
            <path
              :name="`c3-${i}`"
              :d="`M${thick} ${offset.top} h ${height * 2 + thick * 4}`"
            />
            <path
              :name="`c4-${i}`"
              :d="`M${thick} ${offset.top + depth} h ${height * 2 + thick * 4}`"
            />
            <path
              :name="`c5-${i}`"
              :d="`M${offset.left + thick * 3} ${thick} v ${height + thick * 2} h ${-thick * 2}`"
            />
            <path
              :name="`c6-${i}`"
              :d="`M${offset.left + width - thick * 3} ${thick} v ${height + thick * 2}  h ${thick * 2}`"
            />
            <path
              :name="`c7-${i}`"
              :d="`
                M${offset.left - height + hole.short} ${offset.top + (depth - hole.long + hole.short) / 2} v ${hole.long - hole.short}
                a ${hole.short / 2} ${hole.short / 2} 1 1 0 ${hole.short} ${0} v ${-(hole.long - hole.short)}
                a ${hole.short / 2} ${hole.short / 2} 1 1 0 ${-hole.short} ${0}
              `"
            />
            <path
              :name="`c8-${i}`"
              :d="`
                M${offset.left - height - thick * 3 - hole.short} ${offset.top + (depth - hole.long + hole.short) / 2} v ${hole.long - hole.short}
                a ${hole.short / 2} ${hole.short / 2} 1 1 1 ${-hole.short} ${0} v ${-(hole.long - hole.short)}
                a ${hole.short / 2} ${hole.short / 2} 1 1 1 ${hole.short} ${0}
              `"
            />
            <path
              :name="`c9-${i}`"
              :d="`
                M${offset.left + thick - depth / 2} ${height + thick * 3}  v ${hole.short} h ${(hole.long - hole.short) / 2}
                a ${hole.short / 2} ${hole.short / 2} 1 1 1 ${0} ${hole.short} h ${-(hole.long - hole.short) / 2} v ${height - hole.short * 2}
              `"
            />
            <path
              :name="`c10-${i}`"
              :d="`
                M${offset.left + thick - depth / 2} ${height * 3 + depth + thick * 3}  v ${-hole.short}  h ${(hole.long - hole.short) / 2}
                a ${hole.short / 2} ${hole.short / 2} 1 1 0 ${0} ${-hole.short} h ${-(hole.long - hole.short) / 2} v ${-(height - hole.short * 2)}
              `"
            />
            <template
              v-for="r in clip.width.ratio - 1"
            >
              <circle
                :key="`c11-${i}-${r}`"
                :name="`c11-${i}-${r}`"
                :cx="offset.left + thick * 3 + r * (clip.width.high + clip.width.low) + clip.width.low / 2"
                :cy="thick + height / 2"
                :r="circle.radius"
              />
              <circle
                :key="`c12-${i}-${r}`"
                :name="`c12-${i}-${r}`"
                :cx="offset.left + thick * 3 + r * (clip.width.high + clip.width.low) + clip.width.low / 2"
                :cy="offset.top - height / 2"
                :r="circle.radius"
              />
            </template>
          </g>
        </g>
      </template>
    </g>
  </svg>
</template>
<script>
import isOdd from 'is-odd'
export default {
  props: {
    width: {
      type: Number,
      required: true
    },
    depth: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    thick: {
      type: Number,
      required: true
    },
    hole: {
      type: Object,
      required: true
    },
    circle: {
      type: Object,
      required: true
    },
    clip: {
      type: Object,
      required: true
    },
    scale: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      mmRatio: 2.8347,
      show: true
    }
  },
  computed: {
    isOdd () {
      return isOdd
    },
    svg () {
      return {
        width: this.width + this.height * 4 + this.thick * 8,
        height: this.depth + this.height * 4 + this.thick * 6
      }
    },
    viewBox () {
      if (this.scale) {
        return `-11 -11 ${(this.svg.width + 22) * this.mmRatio} ${(this.svg.height + 22) * this.mmRatio}`
      } else {
        return `-11 -11 ${(this.svgView.width + 22) * this.mmRatio} ${(this.svgView.height + 22) * this.mmRatio}`
      }
    },
    transform () {
      if (this.scale) {
        return `scale(${this.mmRatio})`
      } else {
        return `scale(${this.mmRatio}) translate(${(this.svgView.width - this.svg.width) / 2}, ${(this.svgView.height - this.svg.height) / 2})`
      }
    },
    svgView () {
      const width = 600
      const height = 300
      const depth = 400
      const thick = 5
      return {
        width: width + height * 4 + thick * 8,
        height: depth + height * 4 + thick * 6
      }
    },
    offset () {
      return {
        top: this.height * 2 + this.thick * 3,
        left: this.height * 2 + this.thick * 4
      }
    }
  },
  created () {
    this.$watch(vm => [vm.width, vm.depth, vm.height, vm.scale, Date.now()].join(), val => {
      this.redraw()
    })
  },
  beforeMount () {
    window.addEventListener('resize', this.redraw)
  },
  mounted () {
    this.setNonScaling()
  },
  updated () {
    this.setNonScaling()
  },
  beforeDestroy () {
    window.addEventListener('resize', this.redraw)
  },
  methods: {
    redraw () {
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    setNonScaling () {
      for (const element of document.querySelectorAll('#template path, #template circle')) {
        element.setAttribute('vector-effect', 'non-scaling-stroke')
        element.setAttribute('stroke-width', '1')
        element.setAttribute('fill', 'none')
        if (element.parentNode.getAttribute('name') === 'cut') {
          element.setAttribute('stroke', '#2f3542')
        } else if (element.parentNode.getAttribute('name') === 'fold') {
          element.setAttribute('stroke', '#ced6e0')
        }
      }
    }
  }
}
</script>
<style module>
  :root {
    --grisaille: #57606f;
    --prestige: #2f3542;
    --wharf: #747d8c;
    --peace: #a4b0be;
    --twinkle: #ced6e0;
  }

  .svg {
    position: absolute;
    top: 30px;
    left: calc(50% + 30px);
    width: calc(50% - 60px);
    height: calc(100% - 60px);
    fill: none;
    stroke: none;

    @media (width < 600px), screen and (orientation: portrait) {
      top: calc(50% + 30px);
      left: 30px;
      width: calc(100% - 60px);
      height: calc(50% - 60px);
    }
  }
</style>
