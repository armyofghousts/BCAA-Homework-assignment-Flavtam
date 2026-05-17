import { useContext } from "react";
import { CategoryContext } from "./category-provider";
import Loading from "../common/loading";
import Error from "../common/error";
import CategoryList from "./category-list";

const CategoryStateResolver = () => {
  const { data, state, error } = useContext(CategoryContext);

  if (data) {
    return <CategoryList />;
  }

  if (state === "loading" && !data) {
    return (
      <div className="flavtam-loading-page">
        <Loading size={56} />
      </div>
    );
  }

  if (state === "error" && !data) {
    return <Error message={error} />;
  }
};

export default CategoryStateResolver;
