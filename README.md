# at-most-one

```html
<at-most-one attribute=data-selected>
    <iframe name=view1 data-selected></iframe>
    <iframe name=view2></iframe>
    <iframe name=view2></iframe>
</at-most-one>
<script>
document.querySelector('[view2]').setAttribute('data-selected', '');
</script>
```

This will cause data-selected attribute on view1 to go away.

