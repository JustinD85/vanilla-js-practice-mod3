const find = (node) => document.querySelector(node)
const form = find('form'); form.onsubmit = submit //can't add to html directly..hmm

const render = () => {
  const { controlFormTitle, controlFormBody, ideas } = ideaState.getState()
  find('.title').value = controlFormTitle
  find('.body').value = controlFormBody
  find('.card-area').innerHTML = createCards(ideas)
  localStorage.setItem('ideaState', JSON.stringify(ideaState.getState()))
}

const useStateMachine = initialState => { //import
  let innerState = { ...initialState, }
  return {
    setState: newState => {
      innerState = {
        ...innerState, ...newState
      }
    }
    ,
    getState: () => innerState
  }
}

const createCards = ideas => (
  ideas.length ? ideas
    .map(idea => (
      `
    <div class="idea">
    <h2 class="idea-title center-text">
    ${idea.title}
    </h2>
    <p class="idea-body center-text">
    ${idea.body}
    </p>
    <div class="idea-quality center-text" onclick="toggleQuality(${idea.id})">Rating: ${idea.quality[0]}</div>
    <div class="idea-delete center-text" onclick="deleteSelf(${idea.id})">X</div>
    </div>
    `
    ))
    .join('')
    : '...You have no ideas yet'
)

const ideaState = useStateMachine({//can have multiple states: idea,jeopary,etc
  controlFormTitle: '',
  controlFormBody: '',
  ideas: [
    {
      id: Date.now(),
      title: 'Initial State Title',
      body: 'Initial State Description',
      quality: ['Good', 'The Best']
    }],
})


find('.title').addEventListener('keyup', e => {
  ideaState.setState({ controlFormTitle: e.target.value })
  render()
})

find('.body').addEventListener('keyup', e => {
  ideaState.setState({ controlFormBody: e.target.value })
  render()
})

//clears controlform, sets new state
function submit(e) {
  e.preventDefault()
  const { controlFormTitle: title, controlFormBody: body, ideas } = ideaState.getState()
  ideaState.setState({
    controlFormTitle: '',
    controlFormBody: '',
    ideas: [{
      id: Date.now(),
      title,
      body,
      quality: ['Good', 'The Best']
    }, ...ideas]
  })
  render()
}

//update quality up/down
const toggleQuality = id => {
  ideaState.getState()
    .ideas
    .forEach((idea) => {
      if (idea.id === id)
        idea.quality.unshift(idea.quality.pop())
    })

  render()
}

//delete
const deleteSelf = (id) => {
  const newIdeas = ideaState
    .getState()
    .ideas
    .filter(idea => idea.id !== id)

  ideaState.setState({
    ideas: newIdeas
  })
  render()
}

//localstorage
if (localStorage.getItem('ideaState'))
  ideaState.setState(JSON.parse(localStorage.getItem('ideaState')))
render()