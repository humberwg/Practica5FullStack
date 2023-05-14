// /front/src/pages/bookSlot.tsx

import { ApolloClient, InMemoryCache, gql, ApolloError } from '@apollo/client';
import React, { useState } from 'react';
import styles from '../styles/bookSlot.module.css';

export default function BookSlot() {
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [day, setDay] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [dni, setDni] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const client = new ApolloClient({
    uri: 'http://localhost:8080',
    cache: new InMemoryCache()
  });

  const bookSlot = async () => {
    try {
      const { data } = await client.mutate({
        mutation: gql`
          mutation BookSlot($year: Int!, $month: Int!, $day: Int!, $hour: Int!, $dni: String!) {
            bookSlot(year: $year, month: $month, day: $day, hour: $hour, dni: $dni) {
              year
              month
              day
              hour
              dni
            }
          }
        `,
        variables: {
          year,
          month,
          day,
          hour,
          dni
        },
      });

      console.log('Booked Slot:', data.bookSlot);
    } catch (error) {
      console.error('Error while booking slot:', error);
      setErrorMessage('There was an error while booking the slot. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Book a Slot</h1>
      <input type="number" onChange={(e) => setYear(Number(e.target.value))} placeholder="Year" className={styles.input} />
      <input type="number" onChange={(e) => setMonth(Number(e.target.value))} placeholder="Month" className={styles.input} />
      <input type="number" onChange={(e) => setDay(Number(e.target.value))} placeholder="Day" className={styles.input} />
      <input type="number" onChange={(e) => setHour(Number(e.target.value))} placeholder="Hour" className={styles.input} />
      <input type="text" onChange={(e) => setDni(e.target.value)} placeholder="DNI" className={styles.input} />
      <button onClick={bookSlot} className={styles.button}>Book Slot</button>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}
