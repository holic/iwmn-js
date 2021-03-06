# iwmn.js [![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url]

Official Javascript client for the [iwantmyname API](http://dev.iwantmyname.com/docs/)

> Please note that this library and API is still incomplete.


## Usage

#### Browser

Once released, the library will be available for download in `dist/`.

```html
<script src="iwmn.js"></script>
<script>
  var iwmn = new IWMN('your API token here')
</script>
```

#### Node.js

```
npm install iwmn
```

```js
var iwmn = require('iwmn')(process.env.IWMN_TOKEN)
```

#### Calling the API

Callbacks take the form of:

```js
function callback (err, data) {
  // ...
}
```

```js
iwmn.domains.list(callback)
iwmn.domains(domain).get(callback)
iwmn.domains(domain).update(data, callback)
iwmn.domains(domain).nameservers.list(callback)
iwmn.domains(domain).nameservers.replace(data, callback)
iwmn.domains(domain).pending.list(callback)

iwmn.transfers.list(callback)
iwmn.transfers(domain).replace(data, callback)

iwmn.domains(domain).contacts.get(callback)
iwmn.domains(domain).contacts.replace(data, callback)
iwmn.domains(domain).contacts.update(data, callback)
iwmn.domains(domain).contacts[type].get(callback)
iwmn.domains(domain).contacts[type].replace(data, callback)
iwmn.domains(domain).contacts[type].update(data, callback)

iwmn.domains(domain).records.list(callback)
iwmn.domains(domain).records.create(data, callback)
iwmn.domains(domain).records.replace(data, callback)
iwmn.domains(domain).records(id).del(callback)
iwmn.domains(domain).zone.get(callback)
iwmn.domains(domain).zone.replace(data, callback)

iwmn.services.list(callback)
iwmn.services(service).get(callback)
iwmn.domains(domain).services.list(callback)
iwmn.domains(domain).services.create(data, callback)
iwmn.domains(domain).services(id).del(callback)

iwmn.account.get(callback)
iwmn.account.update(data, callback)
iwmn.account.default_contact.get(callback)
iwmn.account.default_contact.replace(data, callback)
iwmn.account.default_contact.update(data, callback)
iwmn.account.default_nameservers.list(callback)
iwmn.account.default_nameservers.replace(data, callback)

iwmn.account.default_billing.get(callback)
iwmn.account.default_billing.replace(data, callback)
iwmn.account.default_billing.del(callback)
iwmn.account.receipts.list(callback)
iwmn.account.receipts(id).get(callback)
iwmn.account.receipts(id).download(format, callback)

iwmn.products.list(callback)
iwmn.products(product).get(callback)
iwmn.tlds.list(callback)
iwmn.tlds(tld).get(callback)
iwmn.search.results.list(callback)
iwmn.search.results(domain).get(callback)
```


[travis-image]: https://img.shields.io/travis/iwantmyname/iwmn-js.svg?style=flat
[travis-url]: https://travis-ci.org/iwantmyname/iwmn-js
[coveralls-image]: https://img.shields.io/coveralls/iwantmyname/iwmn-js.svg?style=flat
[coveralls-url]: https://coveralls.io/r/iwantmyname/iwmn-js
