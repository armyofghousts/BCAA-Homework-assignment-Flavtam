import { useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/esm/Stack";
import Badge from "react-bootstrap/Badge";

import { PlaceListContext } from "./place-list-provider";
import PlaceItem from "./place-item";

function CategoryDetail({
  categoryId,
  count,
  itemList,
  setPlaceItemFormData,
  setPlaceItemDeleteDialog,
}) {
  const { data } = useContext(PlaceListContext);

  return (
    <Accordion.Item eventKey={categoryId} style={{ width: "100%" }}>
      <Accordion.Header className="p-0">
        <Stack direction="horizontal" gap={2}>
          <div>{data?.categoryMap[categoryId]?.name ?? "Neznámá kategorie"}</div>
          <Badge bg="secondary">{count}</Badge>
        </Stack>
      </Accordion.Header>
      <Accordion.Body>
        <Row>
          {itemList?.map((item) => {
            return (
              <PlaceItem
                key={item.id}
                item={item}
                setPlaceItemFormData={setPlaceItemFormData}
                setPlaceItemDeleteDialog={setPlaceItemDeleteDialog}
              />
            );
          })}
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default CategoryDetail;
