# iwmn.js

Official Javascript client for the [iwantmyname API](http://dev.iwantmyname.com/docs/)

> Please note that this library and API is still incomplete.


## Usage

Once released, the library will be available for download in `dist/`.

```js
var iwmn = new IWMN(token)

function callback (err, data) {
  if (err) {
    console.error(err)
    return
  }

  console.log(data)
}

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
iwmn.domains(domain).contacts.owner.get(callback)
iwmn.domains(domain).contacts.owner.replace(data, callback)
iwmn.domains(domain).contacts.owner.update(data, callback)
iwmn.domains(domain).contacts.admin.get(callback)
iwmn.domains(domain).contacts.admin.replace(data, callback)
iwmn.domains(domain).contacts.admin.update(data, callback)
iwmn.domains(domain).contacts.tech.get(callback)
iwmn.domains(domain).contacts.tech.replace(data, callback)
iwmn.domains(domain).contacts.tech.update(data, callback)
iwmn.domains(domain).contacts.billing.get(callback)
iwmn.domains(domain).contacts.billing.replace(data, callback)
iwmn.domains(domain).contacts.billing.update(data, callback)

iwmn.domains(domain).records.list(callback)
iwmn.domains(domain).records.create(data, callback)
iwmn.domains(domain).records.replace(data, callback)
iwmn.domains(domain).records(id).del(callback)
iwmn.domains(domain).zone.get(callback)
iwmn.domains(domain).zone.replace(data, callback)

iwmn.apps.list(callback)
iwmn.apps(app).get(callback)
iwmn.domains(domain).apps.list(callback)
iwmn.domains(domain).apps.create(data, callback)
iwmn.domains(domain).apps(id).del(callback)

iwmn.account.get(callback)
iwmn.account.update(data, callback)
iwmn.account.default_contact.get(callback)
iwmn.account.default_contact.replace(data, callback)
iwmn.account.default_contact.update(data, callback)
iwmn.account.default_nameservers.get(callback)
iwmn.account.default_nameservers.replace(data, callback)

iwmn.account.billing.get(callback)
iwmn.account.billing.create(data, callback)
iwmn.account.billing(id).del(callback)
iwmn.account.receipts.list(callback)
iwmn.account.receipts(id).get(callback)
iwmn.account.receipts(id).download(format)

iwmn.products.list(callback)
iwmn.products(product).get(callback)
iwmn.tlds.list(callback)
iwmn.tlds(tld).get(callback)
iwmn.search.results.list(callback)
iwmn.search.results(domain).get(callback)
```
