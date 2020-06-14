<template>
  <div
    :id="`${title}-button`"
    :class=" active ? $style.buttonActive : $style.button"
    @click="click"
  >
    <svg
      :class="$style.svg"
      viewBox="-1 -1 102 102"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          :d="path"
        />
      </g>
    </svg>
    <div
      :class="$style.title"
    >
      {{ title }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.setNonScaling()
  },
  updated () {
    this.setNonScaling()
  },
  methods: {
    click () {
      this.$emit('click')
    },
    setNonScaling () {
      for (const element of document.querySelectorAll(`#${this.title}-button path, #${this.title}-button circle`)) {
        !element.hasAttribute('vector-effect') && element.setAttribute('vector-effect', 'non-scaling-stroke')
        !element.hasAttribute('stroke-width') && element.setAttribute('stroke-width', '1')
        !element.hasAttribute('fill') && element.setAttribute('fill', 'none')
      }
    }
  }
}
</script>
<style module>
  :root {
    --grisaille: #57606f;
    --peace: #a4b0be;
    --twinkle: #ced6e0;
  }

  .button {
    display: flex;
    flex-direction: column;
    align-items: center;
    stroke: var(--twinkle);
    color: var(--twinkle);
    fill: none;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;

    &:hover {
      stroke: var(--peace);
      color: var(--peace);
    }
  }

  .buttonActive {
    composes: button;
    stroke: var(--grisaille);
    color: var(--grisaille);

    &:hover {
      stroke: var(--grisaille);
      color: var(--grisaille);
    }
  }

  .svg {
    width: 100px;
    height: 100px;
  }

  .title {
    margin: 8px;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
  }
</style>
