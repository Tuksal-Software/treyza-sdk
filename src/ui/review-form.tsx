import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { Button } from "@treyza/sdk/ui/button";
import { Textarea } from "@treyza/sdk/ui/textarea";
import { ReviewStars } from "./review-stars";

interface ReviewFormLabels {
  placeholder?: string;
  submit?: string;
  submitting?: string;
}

const defaultReviewFormLabels: ReviewFormLabels = {
  placeholder: "Yorumunuzu yazin...",
  submit: "Degerlendirmeyi Gonder",
  submitting: "Gonderiliyor...",
};

interface ReviewFormProps extends React.HTMLAttributes<HTMLFormElement> {
  onSubmitReview: (data: { rating: number; comment: string }) => void;
  loading?: boolean;
  labels?: ReviewFormLabels;
}

function ReviewForm({ onSubmitReview, loading, labels: _labels, className, ...props }: ReviewFormProps) {
  const labels = { ...defaultReviewFormLabels, ..._labels };
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmitReview({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", className)} {...props}>
      <ReviewStars rating={rating} interactive onRatingChange={setRating} size="lg" />
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={labels.placeholder}
        rows={3}
      />
      <Button type="submit" disabled={rating === 0 || loading}>
        {loading ? labels.submitting : labels.submit}
      </Button>
    </form>
  );
}

export { ReviewForm };
export type { ReviewFormProps };
