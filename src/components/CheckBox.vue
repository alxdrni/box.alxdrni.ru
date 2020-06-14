<template>
  <div
    :class="$style.checkbox"
    @click="click"
  >
    <div
      :class="active ? $style.squareActive : $style.square"
    />
    <div
      :class="$style.text"
    >
      <div
        :class="$style.word"
      >
        {{ text.split(' ')[0] }}
      </div>
      <div
        :class="$style.word"
      >
        {{ text.split(' ')[1] }}
      </div>
      <div
        :class="$style.word"
      >
        {{ text.split(' ')[2] }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>
<style module>
  :root {
    --grisaille: #57606f;
    --twinkle: #ced6e0;
  }

  .checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &:not(:last-child) {
      margin-right: 32px;
    }

    @media (width < 650px) {
      flex-direction: column;
    }
  }

  .square {
    position: relative;
    flex-basis: 18px;
    width: 18px;
    height: 18px;
    border: 1px solid var(--twinkle);
    margin-right: 9px;

    @media (width < 650px) {
      margin-right: 0;
      margin-bottom: 9px;
    }
  }

  .squareActive {
    composes: square;

    &::after {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      width: 4px;
      height: 4px;
      background: var(--grisaille);
    }
  }

  .text {
    margin-bottom: 2px;
    font-size: 16px;
    color: var(--grisaille);

    @media (width < 650px) {
      text-align: center;
    }
  }

  .word {
    display: inline;

    @media (width < 900px) {
      display: block;
    }
  }
</style>
