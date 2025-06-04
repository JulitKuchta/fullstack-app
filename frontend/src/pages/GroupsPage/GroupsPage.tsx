import React, { useEffect, useState } from "react";
import { groupsApi } from "../../api/groupsApi";
import { useAuth } from "../../context/useAuth";
import styles from "./Group.module.scss";
import GroupMembersPage from "./GroupMembersPage";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

interface Group {
  id: number;
  name: string;
  ownerId: number;
}

const GroupsPage: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  // const [showConfirm, setShowConfirm] = useState(false);
  // const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const data = await groupsApi.getGroups();
    setGroups(data);
  };

  const handleCreateGroup = async () => {
    if (!user || newGroupName.trim().length < 3) return;
    await groupsApi.createGroup(newGroupName);
    setNewGroupName("");
    fetchGroups();
    toast.success("Grupa utworzona");
  };

  // const handleDeleteGroup = async (groupId: number) => {
  //   try {
  //     await groupsApi.deleteGroup(groupId);
  //     toast.success("✅ Grupa usunięta.");
  //     fetchGroups();
  //     setSelectedGroup(null);
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   } catch (error: unknown) {
  //     toast.info("Ta grupa posiada powiązania. Czy na pewno chcesz ją usunąć?");
  //     setPendingDeleteId(groupId);
  //     setShowConfirm(true);
  //   }
  // };

  const handleDeleteClick = (group: Group) => {
    setGroupToDelete(group);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await groupsApi.deleteGroup(groupToDelete.id);
      toast.success("✅ Grupa usunięta.");
      setShowModal(false);
      fetchGroups();
      setSelectedGroup(null);
    } catch (error) {
      console.error("Błąd usuwania grupy:", error);
      toast.error("❌ Nie udało się usunąć grupy.");
    }
  };

  const cancelDelete = () => {
    setGroupToDelete(null);
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <h2>Twoje Grupy</h2>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Nazwa grupy"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button
          onClick={handleCreateGroup}
          disabled={newGroupName.trim().length < 3}
        >
          Utwórz Grupę
        </button>
      </div>

      <ul className={styles.list}>
        {groups.map((group) => (
          <li
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            className={styles.groupItem}
          >
            {group.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(group);
              }}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>

      <ConfirmModal
        message="Czy na pewno chcesz usunąć tę grupę wraz ze wszystkimi powiązaniami?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        visible={showModal}
      />

      {selectedGroup && (
        <GroupMembersPage
          group={selectedGroup}
          onBack={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};

export default GroupsPage;
