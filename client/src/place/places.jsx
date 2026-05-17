import PlaceListProvider from "./place-list-provider";
import PlacesContent from "./places-content";

function Places() {
  return (
    <PlaceListProvider>
      <PlacesContent />
    </PlaceListProvider>
  );
}

export default Places;
