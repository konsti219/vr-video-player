<script>
  export let position = "0 0 0";
  export let rotation = "0 0 0";
  export let color = "#333";
  export let radius = "0.1";
  export let width = "1";
  export let height = "1";
</script>

<a-entity {rotation}>
  <!-- fuck me, instead of just putting half width onto the position making a component to do it for me -->
  <a-rounded
    position={position
      .split(' ')
      .map((p, i) =>
        i === 0
          ? parseFloat(p) - parseFloat(width / 2)
          : i === 1
          ? parseFloat(p) - parseFloat(height / 2)
          : p
      )
      .join(' ')}
    {color}
    {radius}
    {width}
    {height} />
</a-entity>
