// /front/src/pages/removeSlot.tsx

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import React, { useState } from 'react';
import styles from '../styles/removeSlot.module.css';

export default function RemoveSlot() {
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [day, setDay] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const client = new ApolloClient({
    uri: 'http://localhost:8080',
    cache: new InMemoryCache()
  });

  const removeSlot = async () => {
    clearErrorMessage();

    try {
      const { data } = await client.mutate({
        mutation: gql`
          mutation RemoveSlot($year: Int!, $month: Int!, $day: Int!, $hour: Int!) {
            removeSlot(year: $year, month: $month, day: $day, hour: $hour) {
              year
              month
              day
              hour
            }
          }
        `,
        variables: {
          year,
          month,
          day,
          hour
        },
      });

      console.log('Removed Slot:', data.removeSlot);
      setMessage('Slot removed successfully!');
      clearFields();
    } catch (error) {
      console.error('Error while removing slot:', error);
      setErrorMessage('There was an error while removing the slot. Please try again.');
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const clearFields = () => {
    setYear(undefined);
    setMonth(undefined);
    setDay(undefined);
    setHour(undefined);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Remove a Slot</h1>
      <input type="number" onChange={(e) => setYear(Number(e.target.value))} placeholder="Year" className={styles.input} />
      <input type="number" onChange={(e) => setMonth(Number(e.target.value))} placeholder="Month" className={styles.input} />
      <input type="number" onChange={(e) => setDay(Number(e.target.value))} placeholder="Day" className={styles.input} />
      <input type="number" onChange={(e) => setHour(Number(e.target.value))} placeholder="Hour" className={styles.input} />
      <button onClick={removeSlot} className={styles.button}>Remove Slot</button>
      {message && <p className={styles.message}>{message}</p>}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}
