import SkeletonCard from "./SkeletonCard";
import { movieGrid } from "../../constants/theme";

export default function SkeletonGrid({ count = 20 }) {
  return (
    <div className={movieGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
