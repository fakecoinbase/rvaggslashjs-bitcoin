const { Buffer } = require('buffer')
const fs = require('fs')
const path = require('path')

// the 'tx' data found in fixtures/*.tx.js can be generated with some
// debugging code found near the bottom of bitcoin-block/classes/Transaction.js
// these files contain an array with one element per transaction, for each
// transaction we have:
//   1. hash
//   2. txid or null if not segwit
//   3. start byte in block
//   4. end byte in block

// one method of generating the fixture meta data if you trust the pieces involved (i.e. beware of relying on fixtures generated by the code you're testing)
// cid
//   new multiformats.CID(1, multiformats.get('bitcoin-block').code, multiformats.multihash.encode(fromHashHex(bitcoin.BitcoinBlock.decode(Buffer.from(fs.readFileSync('./test/fixtures/500044.hex', 'ascii'), 'hex')).toPorcelain().hash.toString('hex')), 'dbl-sha2-256'))
// or directly:
//   new multiformats.CID(1, multiformats.get('bitcoin-block').code, multiformats.multihash.encode(fromHashHex('0000000000000000001f9ba01120351182680ceba085ffabeaa532cda35f2cc7'), 'dbl-sha2-256'))
// parentCid
//   new multiformats.CID(1, multiformats.get('bitcoin-block').code, multiformats.multihash.encode(fromHashHex(bitcoin.BitcoinBlock.decode(Buffer.from(fs.readFileSync('./test/fixtures/500044.hex', 'ascii'), 'hex')).toPorcelain().previousblockhash.toString('hex')), 'dbl-sha2-256'))
// txCid
//   new multiformats.CID(1, multiformats.get('bitcoin-tx').code, multiformats.multihash.encode(fromHashHex(bitcoin.BitcoinBlock.decode(Buffer.from(fs.readFileSync('./test/fixtures/500044.hex', 'ascii'), 'hex')).toPorcelain().merkleroot.toString('hex')), 'dbl-sha2-256'))
// the tx.js files can be generated by uncommenting a section in bitcoin-block/classes/Transaction.js#_customDecodeSize and decoding the block binary through it:
//   BitcoinBlock.decode(Buffer.from(fs.readFileSync('./test/fixtures/500044.hex', 'ascii'), 'hex'))

const meta = {
  genesis: {
    segwit: false,
    hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
    cid: 'bagyacvran7riycvw6gzxfqngujdk4y7xj6jr5a3f4fnarhdi2ymqaaaaaaaa',
    parentCid: null,
    txCid: 'bagyqcvrahor637l2pmjle6whfq7go5upmf74qg6drcffcmr2t64kusy6lzfa',
    tx: require('./fixtures/genesis.tx')
  },
  300096: {
    segwit: false,
    hash: '00000000000000006af82b3b4f3f00b11cc4ecd9fb75445c0a1238aee8093dd1',
    cid: 'bagyacvra2e6qt2fohajauxceox55t3gedsyqap2phmv7q2qaaaaaaaaaaaaa',
    parentCid: 'bagyacvratq5lon37bw4m3hcsks4bziemvxbqnhymurfho6aaaaaaaaaaaaaa',
    txCid: 'bagyqcvra25ddbpncp4ld3jrhlwtbmkcpbhns2gqzpw772wvx3gnhanlqvcaa',
    tx: require('./fixtures/300096.tx')
  },
  310465: {
    segwit: false,
    hash: '0000000000000000326eb59353e9a575f1a93f2becfa9f1abb1a0f9572afed49',
    cid: 'bagyacvrajhw264uvb4nlwgu77lwcwp5j6f22l2ktso2w4mqaaaaaaaaaaaaa',
    parentCid: 'bagyacvra4iahl2a2q4pcohhndcalougwrubm2ldbdte3oeqaaaaaaaaaaaaa',
    txCid: 'bagyqcvrarokxe2k2ie4tcjunacgnmkjfr3rw5twjqtl2ysojsq4so3emszlq',
    tx: require('./fixtures/310465.tx')
  },
  384931: {
    segwit: false,
    hash: '00000000000000000a4bffdfd5ff5a60051116c07d30f9a590edb55b5ad03e1f',
    cid: 'bagyacvrad47naws3wxwzbjpzgb64afqravqfv76v377uwcqaaaaaaaaaaaaa',
    parentCid: 'bagyacvra25jot5wucq7ijjrktm5nhpntj7ra7mu42zmbgdaaaaaaaaaaaaaa',
    txCid: 'bagyqcvrarbiwgiwb53gvfvab3h5lxtow5cd2rydzwkotwrg653uhxlycoziq',
    tx: require('./fixtures/384931.tx')
  },
  450002: {
    segwit: false,
    hash: '0000000000000000017fd226fff84c38c5eccac41910c020692751ffd5b3361d',
    cid: 'bagyacvradu3lhvp7ketwsigacam4jsxmyu4ez6h7e3jh6aiaaaaaaaaaaaaa',
    parentCid: 'bagyacvraipsgmnermfvoijpoqqmdes5mfiy3b3gcytybyaiaaaaaaaaaaaaa',
    txCid: 'bagyqcvranfjyvz4l66rywq2d4hz2ph632c7qe3l3yqbwxyayupxis3qgwr4a',
    tx: require('./fixtures/450002.tx')
  },
  block: {
    segwit: false,
    hash: '0000000000000002909eabb1da3710351faf452374946a0dfdb247d491c6c23e',
    cid: 'bagyacvrah3bmneoui6zp2dlksr2cgrnpd42ran62wgvz5eacaaaaaaaaaaaa',
    parentCid: 'bagyacvraq7lcikzh2jektykf7z3euc6o6a5eaoedulsmqwicaaaaaaaaaaaa',
    txCid: 'bagyqcvracgs3tjykz27nxp3r56gkgqpivggpe6oet3xi7exbbirco5b3nlvq',
    tx: require('./fixtures/block.tx')
  },
  500044: {
    segwit: true,
    hash: '0000000000000000001f9ba01120351182680ceba085ffabeaa532cda35f2cc7',
    cid: 'bagyacvray4wf7i6ngks6vk77qwqowddiqiitkiarucnr6aaaaaaaaaaaaaaa',
    parentCid: 'bagyacvralvuxpilqt6bzln2rqr4cenhfb2mwjlqdocahkaaaaaaaaaaaaaaa',
    txCid: 'bagyqcvrazne74w2idcauh7nkknrotabw2bpqgzd6t4naffmy45ee63uvl7nq',
    tx: require('./fixtures/500044.tx')
  },
  525343: {
    segwit: true,
    hash: '0000000000000000000ea6d3c8715be17b0f79828bb6872239590bf053c03122',
    cid: 'bagyacvraeiy4au7qbnmtsiuhw2fye6ipppqvw4oi2ota4aaaaaaaaaaaaaaa',
    parentCid: 'bagyacvraheys4ddczzou42mgenuc2o5mhykddmwkyckboaaaaaaaaaaaaaaa',
    txCid: 'bagyqcvracrfe3wh5222eetszamw6gbued6h3ygauact6jt72mfey37lduo2q',
    tx: require('./fixtures/525343.tx')
  },
  551515: {
    segwit: true,
    hash: '000000000000000000222975c4926be6da3bae4d8e93046613209dbd054fc74b',
    cid: 'bagyacvrajpdu6bn5tuqbgzqesohe3lr33ltgxeweouuseaaaaaaaaaaaaaaa',
    parentCid: 'bagyacvraunkcbesedxkms3jmhbnojzxicx4iaxrjwhgasaaaaaaaaaaaaaaa',
    txCid: 'bagyqcvrauchfdyefjt5ebgmlnknm7voitgh6wb3opzbuiickhgyyj4oru2ma',
    tx: require('./fixtures/551515.tx')
  },
  segwit: {
    segwit: true,
    hash: '00000000000000000006d921ce47d509544dec06838a2ff9303c50d12f4a0199',
    cid: 'bagyacvrateauul6rka6db6jprkbqn3cnkqe5kr6oehmqmaaaaaaaaaaaaaaa',
    parentCid: 'bagyacvradn6dsgl6sw2jwoh7s3d37hq5wsu7g22wtdwnmaaaaaaaaaaaaaaa',
    txCid: 'bagyqcvraypzcitp3hsbtyyxhfyc3p7i3226lullm2rkzqsqqlhnxus7tqnea',
    tx: require('./fixtures/segwit.tx')
  },
  segwit2: {
    segwit: true,
    hash: '000000000000000000ac2a49162ec7c457212134e46ab24daa63e0fae949bd90',
    cid: 'bagyacvrasc6ut2p24br2utnsnlsdiijbk7cmolqwjevkyaaaaaaaaaaaaaaa',
    parentCid: 'bagyacvraslynm6bxjw5quictixjy6nn6pasbeid3xwvhcaaaaaaaaaaaaaaa',
    txCid: 'bagyqcvrathrvk65vedb5ixlow3xbr6j3gzs36tens5dsadnufex5xlgcpdbq',
    tx: require('./fixtures/segwit2.tx')
  },
  segwit3: {
    segwit: true,
    hash: '000000000000000000d172ef46944db6127dbebe815664f26f37fef3e22fd65b',
    cid: 'bagyacvralplc7yxt7y3w74tek2a35pt5ck3e3fcg55zncaaaaaaaaaaaaaaa',
    parentCid: 'bagyacvrasl7nphv6ldqwatoaqa3urblhyceb4gxguz4dcaiaaaaaaaaaaaaa',
    txCid: 'bagyqcvramvhtmfzijyga64n25lvj6vhdg5sfkuedfnr54poojntlf65someq',
    tx: require('./fixtures/segwit3.tx')
  }
}

const cache = {}

async function loadFixture (name) {
  if (!cache[name]) {
    const [data, rawHex] = await Promise.all(process.browser
      ? [
        (async () => (await import(`./fixtures/${name}.json`)).default)(),
        (async () => (await import(`!!raw-loader!./fixtures/${name}.hex`)).default)()
      ]
      : [
        (async () => JSON.parse(await fs.promises.readFile(path.join(__dirname, `fixtures/${name}.json`), 'utf8')))(),
        fs.promises.readFile(path.join(__dirname, `fixtures/${name}.hex`), 'ascii')
      ])

    cache[name] = { meta: meta[name], data, raw: Buffer.from(rawHex, 'hex') }
  }
  return cache[name]
}

module.exports = loadFixture
module.exports.names = Object.keys(meta)
module.exports.meta = meta
