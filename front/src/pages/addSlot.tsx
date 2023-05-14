// /front/src/pages/addSlot.tsx

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import React, { useState } from 'react';
import styles from '../styles/addSlot.module.css';

export default function AddSlot() {
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [day, setDay] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [message, setMessage] = useState<string>("");

  const client = new ApolloClient({
    uri: 'http://localhost:8080',
    cache: new InMemoryCache()
  });

  const addSlot = async () => {
    try {
      const { data } = await client.mutate({
        mutation: gql`
          mutation AddSlot($year: Int!, $month: Int!, $day: Int!, $hour: Int!) {
            addSlot(year: $year, month: $month, day: $day, hour: $hour) {
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
          hour,
        },
      });

      setMessage(`Great! You have added a new Slot: Year ${data.addSlot.year}, Month ${data.addSlot.month}, Day ${data.addSlot.day}, Hour ${data.addSlot.hour}`);
      setYear(undefined);
      setMonth(undefined);
      setDay(undefined);
      setHour(undefined);
    } catch (error) {
      setMessage(`There was an error while trying to add the Slot`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add a Slot</h1>
      <input type="number" onChange={(e) => setYear(Number(e.target.value))} placeholder="Year" className={styles.input} value={year || ''} />
      <input type="number" onChange={(e) => setMonth(Number(e.target.value))} placeholder="Month" className={styles.input} value={month || ''} />
      <input type="number" onChange={(e) => setDay(Number(e.target.value))} placeholder="Day" className={styles.input} value={day || ''} />
      <input type="number" onChange={(e) => setHour(Number(e.target.value))} placeholder="Hour" className={styles.input} value={hour || ''} />
      <button onClick={addSlot} className={styles.button}>Add Slot</button>
      {message && (
        <p className={styles.message}>{message}</p>
      )}
    </div>
  );
}