// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('hello world :o')

// define variables that reference elements on our page
const responseForm = document.forms[0]
const responseEl = responseForm.elements.response

const progressEl = document.getElementById('report')
const statusEl = document.getElementById('status')

// listen for the form to be submitted and add a new dream when it is
responseForm.onsubmit = async event => {
  // stop our form submission from refreshing the page
  event.preventDefault()

  const data = { response: !!parseInt(responseEl.value, 10) }

  const res = await fetch('/respond', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })

  // reset form
  responseEl.value = ''
  responseForm.classList.add('hidden')
  getStats()
}

function getStats () {
  fetch('/summary', {})
    .then(res => res.json())
    .then(response => {
      console.log(response)
      const percentage = Math.round(response.yes / response.total * 100)
      progressEl.value = percentage
      statusEl.innerHTML = `${response.yes}/${response.total} (${percentage}%)`
    })
}

getStats()
