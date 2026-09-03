import { WishCard } from "./WishCard";

export function WishList({ wishes, onDelete, deletingId }) {
  if (!wishes?.length) {
    return (
      <div className="wishes-empty">
        <p>មិនទាន់មានពាក្យជូនពរពីភ្ញៀវនៅឡើយទេ។</p>
      </div>
    );
  }

  return (
    <div className="wishes-grid">
      {wishes.map((wish) => (
        <WishCard
          key={wish.id}
          wish={wish}
          onDelete={onDelete}
          isDeleting={deletingId === wish.id}
        />
      ))}
    </div>
  );
}

export default WishList;
