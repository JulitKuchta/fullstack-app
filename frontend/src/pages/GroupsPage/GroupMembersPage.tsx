/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* src/pages/GroupMembersPage/GroupMembersPage.tsx */
import React, { useEffect, useState } from "react";
import { groupsApi } from "../../api/groupsApi";
import { useAuth } from "../../context/useAuth";
import styles from "./Group.module.scss";
import AddGroupTransaction from "./AddGroupTransaction";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import { useBalance } from "../../components/BalanceBar/useBalance";

interface Group {
  id: number;
  name: string;
  ownerId: number;
}

interface Member {
  id: number;
  userId: number;
  groupId: number;
  userEmail: string;
}

interface Props {
  group: Group;
  onBack: () => void;
}

interface Debt {
  id: number;
  debtor: { email: string };
  creditor: { email: string };
  amount: number;
  title: string;
  markedAsPaid: boolean;
  confirmedByCreditor: boolean;
}

const GroupMembersPage: React.FC<Props> = ({ group, onBack }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { refreshBalance } = useBalance();
  useEffect(() => {
    fetchMembers();
  }, [group]);

  const fetchMembers = async () => {
    const data = await groupsApi.getGroupMembers(group.id);
    const debtsData = await groupsApi.getDebts(group.id);
    setDebts(debtsData);
    setMembers(data);
  };

  const handleAddMember = async () => {
    try {
      await groupsApi.addMember(group.id, newMemberEmail);
      setNewMemberEmail("");
      fetchMembers();
    } catch (error: any) {
      console.error("Błąd dodawania członka:", error);
      alert(error.message || "Wystąpił błąd.");
    }
  };

  const handleRemove = async (id: number) => {
    await groupsApi.removeMember(id);
    fetchMembers();
  };

  const handleDeleteDebt = async (debtId: number) => {
    try {
      await groupsApi.deleteDebt(debtId);
      toast.success("Dług usunięty!");
      // Odśwież listę długów:
      fetchMembers();
    } catch (error) {
      toast.error("Błąd usuwania długu.");
      console.error(error);
    }
  };

  const handleMarkAsPaid = async (debtId: number) => {
    await groupsApi.markDebtAsPaid(debtId);
    fetchMembers(); // odśwież dane
  };

  const handleConfirmPayment = async (debtId: number) => {
    await groupsApi.confirmDebtPayment(debtId);
    refreshBalance(null);
    fetchMembers(); // odśwież dane
  };

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backButton}>
        Wróć do grup
      </button>
      <h2>Członkowie grupy: {group.name}</h2>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Email użytkownika"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
        />
        <button
          onClick={handleAddMember}
          disabled={newMemberEmail.trim().length < 3}
        >
          Dodaj członka
        </button>
      </div>

      <AddGroupTransaction
        groupId={group.id}
        onTransactionAdded={fetchMembers}
      />
      <ul className={styles.memberList}>
        {members.map((member) => (
          <li key={member.id}>
            {member.userEmail}
            {member.userId === group.ownerId && (
              <>
                <span className={styles.adminLabel}>(admin)</span>
              </>
            )}
            {user?.id == group.ownerId && member.userId !== group.ownerId && (
              <button
                onClick={() => {
                  setSelectedMemberId(member.id);
                  setShowConfirmModal(true);
                }}
              >
                Usuń
              </button>
            )}
          </li>
        ))}
      </ul>
      {debts.length > 0 && (
        <div className={styles.debtsSection}>
          <h3>Długi w grupie:</h3>
          <ul className={styles.debtsList}>
            {debts.map((debt) => (
              <li key={debt.id}>
                <div className="flex">
                  <strong>{debt.debtor.email}</strong> jest winien{" "}
                  <strong>{debt.creditor.email}</strong>{" "}
                  {debt.amount.toFixed(2)} zł
                  <strong> {debt.title}</strong>
                </div>
                <div className="flex">
                  {debt.markedAsPaid && debt.confirmedByCreditor && (
                    <span className={styles.paidLabel}>✔ Opłacono</span>
                  )}
                  {!debt.markedAsPaid && user?.email === debt.debtor.email && (
                    <button
                      onClick={() => handleMarkAsPaid(debt.id)}
                      className={styles.paidButton}
                    >
                      Opłać
                    </button>
                  )}
                  {debt.markedAsPaid &&
                    !debt.confirmedByCreditor &&
                    user?.email === debt.creditor.email && (
                      <button
                        onClick={() => handleConfirmPayment(debt.id)}
                        className={styles.paidButton}
                      >
                        Potwierdź opłacenie
                      </button>
                    )}
                  {user?.email === debt.creditor.email && (
                    <button
                      className={styles.confirmButton}
                      onClick={() => handleDeleteDebt(debt.id)}
                    >
                      Usuń
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmModal
          visible={showConfirmModal}
          message="Czy na pewno chcesz usunąć tego użytkownika z grupy?"
          onConfirm={async () => {
            if (selectedMemberId !== null) {
              await handleRemove(selectedMemberId);
              setSelectedMemberId(null);
              setShowConfirmModal(false);
            }
          }}
          onCancel={() => {
            setSelectedMemberId(null);
            setShowConfirmModal(false);
          }}
        />
      )}
    </div>
  );
};

export default GroupMembersPage;
