import {
  Catalog,
  Check,
  Collection,
  Item,
  Link,
  OwnedCheck,
  OwnedIssues,
  StacObject,
} from "@stac-types";

export function getCanonicalLink(stac_object: StacObject): Link | undefined {
  return stac_object.links.find(link => link.rel == "canonical");
}

type ApiCheck = {
  isSuccess: boolean;
  label: string;
};

export async function getLinkHref(link: Link): Promise<ApiCheck> {
  try {
    const response = await fetch(link.href);
    if (!response.ok) {
      return {
        isSuccess: false,
        label: response.status + " " + response.statusText,
      };
    } else {
      return {
        isSuccess: true,
        label: "API is up!",
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      label: error,
    };
  }
}

function intoOwnedCheck(
  check: Check,
  catalog: Catalog,
  collection: Collection | undefined,
  item: Item | undefined
): OwnedCheck {
  return {
    rule_id: check.rule_id,
    score: check.score,
    message: check.message,
    catalog: catalog,
    collection: collection,
    item: item,
  };
}

export function getIssues(
  catalog: Catalog,
  collections: Collection[],
  items: Item[]
): OwnedIssues {
  let issues = {
    high: catalog["heystac:rating"].issues.high.map(check =>
      intoOwnedCheck(check, catalog, undefined, undefined)
    ),
    medium: catalog["heystac:rating"].issues.medium.map(check =>
      intoOwnedCheck(check, catalog, undefined, undefined)
    ),
    low: catalog["heystac:rating"].issues.low.map(check =>
      intoOwnedCheck(check, catalog, undefined, undefined)
    ),
  };
  for (let index = 0; index < collections.length; index++) {
    const collection = collections[index];
    issues.high.push(
      ...collection["heystac:rating"].issues.high.map(check =>
        intoOwnedCheck(check, catalog, collection, undefined)
      )
    );
    issues.medium.push(
      ...collection["heystac:rating"].issues.medium.map(check =>
        intoOwnedCheck(check, catalog, collection, undefined)
      )
    );
    issues.low.push(
      ...collection["heystac:rating"].issues.low.map(check =>
        intoOwnedCheck(check, catalog, collection, undefined)
      )
    );
  }
  // TODO we can provide collection here too
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    issues.high.push(
      ...item.properties["heystac:rating"].issues.high.map(check =>
        intoOwnedCheck(check, catalog, undefined, item)
      )
    );
    issues.medium.push(
      ...item.properties["heystac:rating"].issues.medium.map(check =>
        intoOwnedCheck(check, catalog, undefined, item)
      )
    );
    issues.low.push(
      ...item.properties["heystac:rating"].issues.low.map(check =>
        intoOwnedCheck(check, catalog, undefined, item)
      )
    );
  }
  return issues;
}
