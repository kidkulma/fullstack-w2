import React from 'react'
import Person from './components/Person'
import Input from './components/Input'
import numberService from './services/numbers'
import Message from './components/Message'
import Error from './components/Error'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      filter: '',
      message: null,
      error: null
    }
    console.log('constructor')
  }

  componentDidMount() {
    console.log('did mount')
    numberService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        this.setState({ persons: response })
      })
  }

  addNumber = (event) => {
    const filteredPersons = this.state.persons.filter(person => person.name.toLowerCase().includes(this.state.newName.toLowerCase()))
    console.log(filteredPersons)
    if (filteredPersons.length === 1) {
      if (window.confirm(`${filteredPersons[0].name} on jo luettelossa, korvataanko vanha numero uudella?`)) {
        return this.updateNumber(event, filteredPersons[0].id)
      } else {
        return this.setState({
          newName: '',
          newNumber: ''
        })
      }
    }
    return this.addNewNumber(event)
  }

  addNewNumber = (event) => {
    event.preventDefault()
    const numberObject = {
      name: this.state.newName,
      number: this.state.newNumber
    }
    numberService
      .create(numberObject)
      .then(response => {
        console.log('promise fulfilled')
        this.setMessage(`Lisättiin ${this.state.newName}`, 5000)
        this.setState({
          persons: this.state.persons.concat(response),
          newName: '',
          newNumber: ''
        })
        console.log('number added')
      })
  }

  updateNumber = (event, id) => {
    event.preventDefault()
    const numberObject = {
      id: id,
      name: this.state.newName,
      number: this.state.newNumber
    }
    numberService
      .update(id, numberObject)
      .then(() => {
        console.log('promise fulfilled')
        const index = this.state.persons.findIndex(function findi(element) { return element.id === id })
        const persons = this.state.persons
        persons[index] = numberObject
        this.setMessage(`Päivitettiin ${this.state.newName}`, 5000)
        this.setState({
          persons,
          newName: '',
          newNumber: ''
        })
        console.log('number updated')
      }).catch(error => {
        this.setError(`Henkilön ${this.state.newName} päivitys epäonnistui, henkilön tietoja ei löytynyt palvelimelta.`, 5000)
        this.setState({
          persons: this.state.persons.filter(p => p.id !== id),
          newName: '',
          newNumber: ''
        })
        console.log('error')
      })
  }

  remove = (person) => {
    return () => {
      if (window.confirm(`poistetaanko ${person.name}?`)) {
        numberService
          .remove(person.id)
          .then(() => {
            console.log('promise fulfilled')
            this.setState({
              persons: this.state.persons.filter(p => p.id !== person.id)
            })
            console.log('number deleted')
            this.setMessage(`Poistettiin ${person.name}`, 5000)
          })
      }
    }
  }

  setMessage = (newMessage, timeout) => {
    this.setState({ message: newMessage })
    setTimeout(() => { this.setState({ message: null }) }, timeout)
  }

  setError = (newError, timeout) => {
    this.setState({ error: newError })
    setTimeout(() => { this.setState({ error: null }) }, timeout)
  }

  handleNameChange = (event) => {
    console.log(event.target.value)
    this.setState({ newName: event.target.value })
  }

  handleNumberChange = (event) => {
    console.log(event.target.value)
    this.setState({ newNumber: event.target.value })
  }

  handleFilterChange = (event) => {
    console.log(event.target.value)
    this.setState({ filter: event.target.value })
  }

  render() {
    console.log('rendering')
    const personsToShow = this.state.filter === '' ?
      this.state.persons :
      this.state.persons.filter(person => person.name.toLowerCase().includes(this.state.filter.toLowerCase()))

    return (
      <div>
        <Message message={this.state.message} />
        <Error message={this.state.error} />
        <h1>Puhelinluettelo</h1>
        <Input
          value={this.state.filter}
          onChange={this.handleFilterChange}
          text="rajaa näytettäviä"
        />
        <h2>Lisää uusi / päivitä olemassa olevaa numeroa</h2>
        <form onSubmit={this.addNumber}>
          <Input
            value={this.state.newName}
            onChange={this.handleNameChange}
            text="nimi"
          />
          <Input
            value={this.state.newNumber}
            onChange={this.handleNumberChange}
            text="numero"
          />
          <button type="submit">Lisää/Päivitä</button>
        </form>
        <h2>Numerot</h2>
        <table>
          <tbody>
            {personsToShow.map(person => <Person key={person.id} person={person} text="Poista" handleClick={this.remove(person)} />)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App;