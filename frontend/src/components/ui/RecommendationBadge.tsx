import { RecommendationType } from "@/types/analysis";

type RecommendationBadgeProps = {
	recommendation: RecommendationType;
};

export default function RecommendationBadge({ recommendation }: RecommendationBadgeProps) {
	const styles = getRecommendationStyles(recommendation);

	return (
		<span
			className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${styles}`}
		>
			{recommendation}
		</span>
	);
}

function getRecommendationStyles(recommendation: RecommendationType): string {
	switch (recommendation) {
		case "Strong Buy":
			return "bg-green-100 text-green-800 border border-green-200";
		case "Watchlist":
			return "bg-blue-100 text-blue-800 border border-blue-200";
		case "Proceed with Caution":
			return "bg-yellow-100 text-yellow-800 border border-yellow-200";
		case "Reject":
			return "bg-red-100 text-red-800 border border-red-200";
	}
}
