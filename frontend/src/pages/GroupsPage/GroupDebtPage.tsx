/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { groupsApi } from "../../api/groupsApi";
import { useParams } from "react-router-dom";
import styles from "./Group.module.scss";

const GroupDebtsPage: React.FC = () => {
  const { groupId } = useParams();
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    const data = await groupsApi.getDebts(Number(groupId));
    setDebts(data);
  };

  return (
    <div className={styles.debtsContainer}>
      <h1>Długi w grupie</h1>
      <ul className={styles.list}>
        {debts.map((debt: any) => (
          <li key={debt.id} className={styles.debtItem}>
            Użytkownik <strong>{debt.fromUserId}</strong> musi oddać
            użytkownikowi <strong>{debt.toUserId}</strong> kwotę{" "}
            <strong>{debt.amount.toFixed(2)} zł</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupDebtsPage;
