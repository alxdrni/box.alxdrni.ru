<template>
  <div
    :class="$style.button"
    @click="click"
  >
    <span
      :class="$style.text"
    >
      {{ text }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
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

  .button {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 14px;
    padding-bottom: 2px;
    border: 1px solid var(--twinkle);
    border-radius: 100px;
    margin-left: 96px;
    font-size: 16px;
    color: var(--grisaille);
    cursor: pointer;
    user-select: none;

    &:hover {
      border-color: var(--grisaille);
    }

    @media (width < 950px) {
      margin-left: 0;
    }

    @media (width < 650px) {
      width: 46px;
      height: 46px;
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0NiA0NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDYgNDY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7ZGlzcGxheTpub25lO30uc3Qxe2Rpc3BsYXk6aW5saW5lO2ZpbGw6Izk5OTk5OTt9LnN0MntkaXNwbGF5OmlubGluZTt9LnN0M3tmaWxsOiM1NzYwNkY7fTwvc3R5bGU+PGcgaWQ9IkxheWVyXzEiIGNsYXNzPSJzdDAiPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNC4zLDIxLjJjLTAuNCwwLTAuNywwLjMtMC43LDAuN3Y2YzAsMS42LTEuMywzLTMsM0gxNi4xYy0xLjYsMC0zLTEuMy0zLTN2LTYuMWMwLTAuNC0wLjMtMC43LTAuNy0wLjdjLTAuNCwwLTAuNywwLjMtMC43LDAuN3Y2LjFjMCwyLjQsMS45LDQuMyw0LjMsNC4zaDE0LjZjMi40LDAsNC4zLTEuOSw0LjMtNC4zdi02QzM1LDIxLjUsMzQuNywyMS4yLDM0LjMsMjEuMkwzNC4zLDIxLjJ6IE0zNC4zLDIxLjIiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjIuOSwyNi45YzAuMSwwLjEsMC4zLDAuMiwwLjUsMC4yYzAuMiwwLDAuMy0wLjEsMC41LTAuMmw0LjItNC4yYzAuMy0wLjMsMC4zLTAuNywwLTAuOWMtMC4zLTAuMy0wLjctMC4zLTAuOSwwbC0zLjEsMy4xVjExLjNjMC0wLjQtMC4zLTAuNy0wLjctMC43cy0wLjcsMC4zLTAuNywwLjd2MTMuNWwtMy4xLTMuMWMtMC4zLTAuMy0wLjctMC4zLTAuOSwwYy0wLjMsMC4zLTAuMywwLjcsMCwwLjlMMjIuOSwyNi45eiBNMjIuOSwyNi45Ii8+PGcgY2xhc3M9InN0MiI+PHBhdGggZD0iTTIzLDFjMTIuMSwwLDIyLDkuOSwyMiwyMnMtOS45LDIyLTIyLDIyUzEsMzUuMSwxLDIzUzEwLjksMSwyMywxIE0yMywwQzEwLjMsMCwwLDEwLjMsMCwyM3MxMC4zLDIzLDIzLDIzczIzLTEwLjMsMjMtMjNTMzUuNywwLDIzLDBMMjMsMHoiLz48L2c+PC9nPjxnIGlkPSJMYXllcl8yIj48cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjI4LDIyLjIgMjQuMiwyNiAyNCwyNi4yIDIzLjUsMjYuNyAyMywyNi4yIDIyLjgsMjYgMTksMjIuMiAxOS43LDIxLjUgMjMsMjQuOCAyMywxMSAyNCwxMSAyNCwyNC44IDI3LjMsMjEuNSAiLz48cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjM0LDIxIDM0LDI4LjMgMzEuMywzMSAxNS43LDMxIDEzLDI4LjMgMTMsMjEgMTIsMjEgMTIsMjcuMyAxMiwyOC43IDEzLDI5LjcgMTUsMzEuNyAxNS4zLDMyIDE2LjcsMzIgMzAuMywzMiAzMS43LDMyIDMyLDMyIDMyLDMxLjcgMzQsMjkuNyAzNSwyOC43IDM1LDI3LjMgMzUsMjEgIi8+PC9nPjwvc3ZnPg==);
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  .text {
    @media (width < 650px) {
      display: none;
    }
  }
</style>
