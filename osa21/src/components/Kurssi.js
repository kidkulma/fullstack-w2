import React from 'react'

const Kurssi = ({ kurssi }) => {
    return (
      <div>
        <Otsikko kurssi={kurssi} />
        <Sisalto kurssi={kurssi} />
        <Yhteensa kurssi={kurssi} />
      </div>
    )
  }
  
  const Otsikko = ({ kurssi }) => {
    return <h1>{kurssi.nimi}</h1>
  }
  
  const Sisalto = ({ kurssi }) => {
    return (
      <div>{kurssi.osat.map(osa => <Osa key={osa.id} osa={osa} />)}</div>
    )
  }
  
  const Osa = ({ osa }) => {
    return (
      <p>{osa.nimi} {osa.tehtavia}</p>
    )
  }
  
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  
  const Yhteensa = ({ kurssi }) => {
    return (
      <p>Tehtäviä yhteensä: {kurssi.osat.map(osa => osa.tehtavia ).reduce(reducer)}</p>
    )
  }

  export default Kurssi