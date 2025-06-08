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
import { useNavigate, useParams } from "react-router-dom";

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
  group?: Group;
  onBack?: () => void;
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

const GroupMembersPage: React.FC<Props> = (props) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { refreshBalance } = useBalance();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);

  // Użyj propsów jeśli istnieją, w przeciwnym razie użyj wartości z URL i nawigacji
  const currentGroup = props.group || (group as Group);
  const handleBack = props.onBack || (() => navigate('/groups'));

  useEffect(() => {
    if (!props.group && groupId) {
      // Pobierz grupę, jeśli nie została przekazana jako prop
      fetchGroup();
    }
    fetchMembers();
  }, [groupId, props.group]);

  const fetchGroup = async () => {
    try {
      const data = await groupsApi.getGroup(Number(groupId));
      setGroup(data);
    } catch (error) {
      console.error("Błąd pobierania grupy:", error);
      navigate('/groups');
    }
  };

  const fetchMembers = async () => {
    const id = props.group?.id || Number(groupId);
    if (!id) return;

    const data = await groupsApi.getGroupMembers(id);
    const debtsData = await groupsApi.getDebts(id);
    setDebts(debtsData);
    setMembers(data);
  };

  const handleAddMember = async () => {
    try {
      const id = currentGroup?.id || Number(groupId);
      await groupsApi.addMember(id, newMemberEmail);
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

  // Jeśli używamy komponentu przez routing i grupa jest jeszcze ładowana
  if (!props.group && !group) {
    return <div className={styles.container}>Ładowanie...</div>;
  }

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
        Wróć do grup
      </button>
      <h2>Członkowie grupy: {currentGroup.name}</h2>

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
        groupId={currentGroup.id}
        onTransactionAdded={fetchMembers}
      />
      <ul className={styles.memberList}>
        {members.map((member) => (
          <li key={member.id}>
            {member.userEmail}
            {member.userId === currentGroup.ownerId && (
              <>
                <span className={styles.adminLabel}>(admin)</span>
              </>
            )}
            {user?.id == currentGroup.ownerId && member.userId !== currentGroup.ownerId && (
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
