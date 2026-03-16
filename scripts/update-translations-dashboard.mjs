#!/usr/bin/env node
/**
 * Batch update translations for dashboard simplification.
 * Adds new keys and updates countryDelivery.medianWait.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const messagesDir = join(__dirname, '..', 'messages')

// New keys per locale
const translations = {
  de: {
    'statistics.orderSources': 'Herkunft',
    'statistics.deliveryPipeline': 'Lieferweg',
    'statistics.timelineOrder': 'Bestellung',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Produktion',
    'statistics.timelinePapers': 'Papiere',
    'statistics.timelineDelivery': 'Auslieferung',
    'countryDelivery.medianWait': 'Wartezeit',
  },
  en: {
    'statistics.orderSources': 'Sources',
    'statistics.deliveryPipeline': 'Delivery Pipeline',
    'statistics.timelineOrder': 'Order',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Production',
    'statistics.timelinePapers': 'Papers',
    'statistics.timelineDelivery': 'Delivery',
    'countryDelivery.medianWait': 'Wait Time',
  },
  fr: {
    'statistics.orderSources': 'Sources',
    'statistics.deliveryPipeline': 'Pipeline de livraison',
    'statistics.timelineOrder': 'Commande',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Production',
    'statistics.timelinePapers': 'Documents',
    'statistics.timelineDelivery': 'Livraison',
    'countryDelivery.medianWait': 'Délai',
  },
  nl: {
    'statistics.orderSources': 'Bronnen',
    'statistics.deliveryPipeline': 'Leveringspijplijn',
    'statistics.timelineOrder': 'Bestelling',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Productie',
    'statistics.timelinePapers': 'Papieren',
    'statistics.timelineDelivery': 'Levering',
    'countryDelivery.medianWait': 'Wachttijd',
  },
  es: {
    'statistics.orderSources': 'Fuentes',
    'statistics.deliveryPipeline': 'Pipeline de entrega',
    'statistics.timelineOrder': 'Pedido',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Producción',
    'statistics.timelinePapers': 'Documentos',
    'statistics.timelineDelivery': 'Entrega',
    'countryDelivery.medianWait': 'Tiempo de espera',
  },
  pt: {
    'statistics.orderSources': 'Fontes',
    'statistics.deliveryPipeline': 'Pipeline de entrega',
    'statistics.timelineOrder': 'Pedido',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Produção',
    'statistics.timelinePapers': 'Documentos',
    'statistics.timelineDelivery': 'Entrega',
    'countryDelivery.medianWait': 'Tempo de espera',
  },
  it: {
    'statistics.orderSources': 'Fonti',
    'statistics.deliveryPipeline': 'Pipeline di consegna',
    'statistics.timelineOrder': 'Ordine',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Produzione',
    'statistics.timelinePapers': 'Documenti',
    'statistics.timelineDelivery': 'Consegna',
    'countryDelivery.medianWait': 'Attesa',
  },
  no: {
    'statistics.orderSources': 'Kilder',
    'statistics.deliveryPipeline': 'Leveringspipeline',
    'statistics.timelineOrder': 'Bestilling',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Produksjon',
    'statistics.timelinePapers': 'Papirer',
    'statistics.timelineDelivery': 'Levering',
    'countryDelivery.medianWait': 'Ventetid',
  },
  sv: {
    'statistics.orderSources': 'Källor',
    'statistics.deliveryPipeline': 'Leveranspipeline',
    'statistics.timelineOrder': 'Beställning',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Produktion',
    'statistics.timelinePapers': 'Dokument',
    'statistics.timelineDelivery': 'Leverans',
    'countryDelivery.medianWait': 'Väntetid',
  },
  da: {
    'statistics.orderSources': 'Kilder',
    'statistics.deliveryPipeline': 'Leveringspipeline',
    'statistics.timelineOrder': 'Bestilling',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Produktion',
    'statistics.timelinePapers': 'Papirer',
    'statistics.timelineDelivery': 'Levering',
    'countryDelivery.medianWait': 'Ventetid',
  },
  fi: {
    'statistics.orderSources': 'Lähteet',
    'statistics.deliveryPipeline': 'Toimitusputki',
    'statistics.timelineOrder': 'Tilaus',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Tuotanto',
    'statistics.timelinePapers': 'Asiakirjat',
    'statistics.timelineDelivery': 'Toimitus',
    'countryDelivery.medianWait': 'Odotusaika',
  },
  pl: {
    'statistics.orderSources': 'Źródła',
    'statistics.deliveryPipeline': 'Pipeline dostawy',
    'statistics.timelineOrder': 'Zamówienie',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Produkcja',
    'statistics.timelinePapers': 'Dokumenty',
    'statistics.timelineDelivery': 'Dostawa',
    'countryDelivery.medianWait': 'Czas oczekiwania',
  },
  cs: {
    'statistics.orderSources': 'Zdroje',
    'statistics.deliveryPipeline': 'Pipeline dodání',
    'statistics.timelineOrder': 'Objednávka',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Výroba',
    'statistics.timelinePapers': 'Dokumenty',
    'statistics.timelineDelivery': 'Dodání',
    'countryDelivery.medianWait': 'Čekací doba',
  },
  hu: {
    'statistics.orderSources': 'Források',
    'statistics.deliveryPipeline': 'Szállítási folyamat',
    'statistics.timelineOrder': 'Rendelés',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Gyártás',
    'statistics.timelinePapers': 'Dokumentumok',
    'statistics.timelineDelivery': 'Kiszállítás',
    'countryDelivery.medianWait': 'Várakozási idő',
  },
  ro: {
    'statistics.orderSources': 'Surse',
    'statistics.deliveryPipeline': 'Pipeline livrare',
    'statistics.timelineOrder': 'Comandă',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Producție',
    'statistics.timelinePapers': 'Documente',
    'statistics.timelineDelivery': 'Livrare',
    'countryDelivery.medianWait': 'Timp de așteptare',
  },
  hr: {
    'statistics.orderSources': 'Izvori',
    'statistics.deliveryPipeline': 'Pipeline isporuke',
    'statistics.timelineOrder': 'Narudžba',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Proizvodnja',
    'statistics.timelinePapers': 'Dokumenti',
    'statistics.timelineDelivery': 'Isporuka',
    'countryDelivery.medianWait': 'Vrijeme čekanja',
  },
  bg: {
    'statistics.orderSources': 'Източници',
    'statistics.deliveryPipeline': 'Тръбопровод за доставка',
    'statistics.timelineOrder': 'Поръчка',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Производство',
    'statistics.timelinePapers': 'Документи',
    'statistics.timelineDelivery': 'Доставка',
    'countryDelivery.medianWait': 'Време на изчакване',
  },
  sk: {
    'statistics.orderSources': 'Zdroje',
    'statistics.deliveryPipeline': 'Pipeline dodania',
    'statistics.timelineOrder': 'Objednávka',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Výroba',
    'statistics.timelinePapers': 'Dokumenty',
    'statistics.timelineDelivery': 'Dodanie',
    'countryDelivery.medianWait': 'Čakacia doba',
  },
  el: {
    'statistics.orderSources': 'Πηγές',
    'statistics.deliveryPipeline': 'Σωλήνας παράδοσης',
    'statistics.timelineOrder': 'Παραγγελία',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Παραγωγή',
    'statistics.timelinePapers': 'Έγγραφα',
    'statistics.timelineDelivery': 'Παράδοση',
    'countryDelivery.medianWait': 'Χρόνος αναμονής',
  },
  tr: {
    'statistics.orderSources': 'Kaynaklar',
    'statistics.deliveryPipeline': 'Teslimat hattı',
    'statistics.timelineOrder': 'Sipariş',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': 'Üretim',
    'statistics.timelinePapers': 'Belgeler',
    'statistics.timelineDelivery': 'Teslimat',
    'countryDelivery.medianWait': 'Bekleme süresi',
  },
  zh: {
    'statistics.orderSources': '来源',
    'statistics.deliveryPipeline': '交付流程',
    'statistics.timelineOrder': '订单',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': '生产',
    'statistics.timelinePapers': '文件',
    'statistics.timelineDelivery': '交付',
    'countryDelivery.medianWait': '等待时间',
  },
  ja: {
    'statistics.orderSources': 'ソース',
    'statistics.deliveryPipeline': '納車パイプライン',
    'statistics.timelineOrder': '注文',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': '製造',
    'statistics.timelinePapers': '書類',
    'statistics.timelineDelivery': '納車',
    'countryDelivery.medianWait': '待ち時間',
  },
  ko: {
    'statistics.orderSources': '출처',
    'statistics.deliveryPipeline': '배송 파이프라인',
    'statistics.timelineOrder': '주문',
    'statistics.timelineVin': 'VIN',
    'statistics.timelineProduction': '생산',
    'statistics.timelinePapers': '서류',
    'statistics.timelineDelivery': '배송',
    'countryDelivery.medianWait': '대기 시간',
  },
}

function setNested(obj, dottedKey, value) {
  const keys = dottedKey.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}

let updated = 0
for (const [locale, keys] of Object.entries(translations)) {
  const filePath = join(messagesDir, `${locale}.json`)
  let json
  try {
    json = JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch (e) {
    console.error(`Failed to read ${locale}.json:`, e.message)
    continue
  }

  for (const [dottedKey, value] of Object.entries(keys)) {
    setNested(json, dottedKey, value)
  }

  writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf-8')
  updated++
  console.log(`Updated ${locale}.json`)
}

console.log(`\nDone: ${updated} files updated.`)
