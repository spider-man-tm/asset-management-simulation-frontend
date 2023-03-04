<template>
  <h1>404 Not Found</h1>
  <br />
  <h2>お探しのページが見つかりません</h2>
</template>

<script>
export default {
  name: 'NotFoundPage',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
