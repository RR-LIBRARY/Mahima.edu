import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/data/mockData";

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

const CourseCard = ({ course, onClick }: CourseCardProps) => {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          Grade {course.grade}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
