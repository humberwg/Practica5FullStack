/*
  El renderizado se realiza en el cliente (CSR) debido a que el contenido de la pagina depende de la interacción del usuario por lo que se puede proporcionar
  retroalimentación en tiempo real, además de que el contenido es poco y puede ser renderizado en el cliente.
*/

import { ApolloClient, InMemoryCache, gql, ApolloError } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/availableSlots.module.css';

export default function AvailableSlots() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [day, setDay] = useState<number>(new Date().getDate());
  const [slots, setSlots] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const client = new ApolloClient({
    uri: 'http://localhost:8080',
    cache: new InMemoryCache()
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const { data } = await client.query({
          query: gql`
            query GetSlots($year: Int!, $month: Int!, $day: Int) {
              availableSlots(year: $year, month: $month, day: $day) {
                day
                month
                year
                hour
                available
                dni
              }
            }
          `,
          variables: {
            year,
            month,
            day,
          },
        });

        setSlots(data.availableSlots);
      } catch (error) {
        console.error('Error while fetching slots:', error);
        setErrorMessage('There was an error while fetching the slots. Please try again.');
      }
    };

    fetchSlots();
  }, [year, month, day]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Available Slots</h1>
      <input type="number" onChange={(e) => setYear(Number(e.target.value))} placeholder="Year" className={styles.input} />
      <input type="number" onChange={(e) => setMonth(Number(e.target.value))} placeholder="Month" className={styles.input} />
      <input type="number" onChange={(e) => setDay(Number(e.target.value))} placeholder="Day" className={styles.input} />
      <button onClick={() => console.log("Search")} className={styles.button}>Search</button>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {slots.length ? (
        <ul className={styles.list}>
          {slots.map((slot, index) => (
            <li key={index} className={styles.item}>
              Day: {slot.day}, Month: {slot.month}, Year: {slot.year}, Hour: {slot.hour}, Available: {slot.available ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No slots available</p>
      )}
    </div>
  );
}
