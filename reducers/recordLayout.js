function getLayoutItemModel(objectInfo, record, recordType, item) {
  const result = {};
  result.label = item.label;

  const values = [];
  let linkId;
  let linkText;
  let customLinkUrl;
  let customText;

  (item.layoutComponents || []).forEach(component => {
    let picklistUrl;

    // Component display info.
    if (component.componentType === 'Field') {
      const compValue = component.apiName;
      const fieldInfo = objectInfo.fields[compValue];

      // Picklist value URL.
      if (fieldInfo && fieldInfo.dataType === 'Picklist') {
        picklistUrl = `/services/data/v41.0/ui-api/object-info/${
          objectInfo.apiName
        }/picklist-values/${recordType}/${fieldInfo.apiName}`;
      }

      // Reference link.
      if (fieldInfo && fieldInfo.reference) {
        // The relationship may be absent if it amounts to null.
        if (record.fields[fieldInfo.relationshipName]) {
          const relatedData = record.fields[fieldInfo.relationshipName].value;
          if (relatedData) {
            linkId = relatedData.fields.Id.value;
            linkText = relatedData.fields.Name.value;
          }
        }
      }

      if (
        fieldInfo &&
        (fieldInfo.type === 'Datetime' || fieldInfo.type === 'DateOnly')
      ) {
        const currValue = record.fields[compValue].value;
        const formattedData = new Date(currValue);
        values.push({
          displayValue: formattedData,
          value: currValue,
          label: component.label,
          field: compValue,
          fieldInfo,
          picklistUrl,
          editableForNew: item.editableForNew,
          editableForUpdate: item.editableForUpdate,
          isNull: currValue === null
        });
      } else if (record.fields[compValue]) {
        let displayValue = record.fields[compValue].displayValue;
        const rawValue = record.fields[compValue].value;
        if (displayValue === null && rawValue !== null) {
          displayValue = rawValue.toString();
        }
        values.push({
          displayValue,
          value: rawValue,
          label: component.label,
          field: compValue,
          fieldInfo,
          picklistUrl,
          editableForNew: item.editableForNew,
          editableForUpdate: item.editableForUpdate,
          isNull: displayValue === null
        });
      } else {
        console.log(`Missing expected field: ${compValue}`);
      }
    } else if (component.componentType === 'CustomLink') {
      customLinkUrl = component.customLinkUrl;
      linkText = component.label;
    } else if (component.componentType === 'Canvas') {
      customText = `Canvas: ${component.apiName}`;
    } else if (component.componentType === 'EmptySpace') {
      customText = '';
    } else if (component.componentType === 'VisualforcePage') {
      customText = `VF Page: ${component.apiName}`;
    } else if (component.componentType === 'ReportChart') {
      customText = `Report Chart: ${component.apiName}`;
    }
  });

  result.values = values;
  result.linkId = linkId;
  result.linkText = linkText;
  result.customLinkUrl = customLinkUrl;
  result.customText = customText;

  return result;
}

function getLayoutRowModel(objectInfo, record, recordType, itemsIn) {
  const items = [];

  (itemsIn || []).forEach(item => {
    items.push(getLayoutItemModel(objectInfo, record, recordType, item));
  });

  const result = {
    items
  };
  return result;
}

function getLayoutSectionModel(objectInfo, record, recordType, section) {
  const result = {};
  result.heading = section.heading;
  result.useHeading = section.useHeading ? section.useHeading : false;

  const rows = [];
  (section.layoutRows || []).forEach(row => {
    rows.push(
      getLayoutRowModel(objectInfo, record, recordType, row.layoutItems)
    );
  });

  result.rows = rows;
  return result;
}

function getLayoutModelForDefaults(defaults) {
  const objectInfo = defaults.objectInfo;
  const record = defaults.record;
  const layout = defaults.layout;

  let recordType = '012000000000000AAA'; // 'Master'
  if (record.recordTypeInfo) {
    recordType = record.recordTypeInfo.recordTypeId;
  }

  const layouts = {};
  const editValues = {};

  try {
    const modeType = layout.mode;
    const layoutType = layout.layoutType;

    layouts[layoutType] = {};

    const sections = layout.sections.map(section =>
      getLayoutSectionModel(objectInfo, record, recordType, section)
    );
    sections.forEach(section =>
      section.rows.forEach(row =>
        row.items.forEach(item =>
          item.values.forEach(
            value =>
              (editValues[value.field] = {
                original: value.value,
                current: value.value
              })
          )
        )
      )
    );
    layouts[layoutType][modeType] = sections;

    const result = {
      layouts,
      editValues,
      objectInfo,
      apiName: objectInfo.apiName
    };
    return result;
  } catch (err) {
    console.log(`ERROR CREATING DEFAULTS LAYOUT MODEL ${err}`);
    return { layouts: [], editValues: {}, objectInfo: {}, apiName: null };
  }
}

function getLayoutModel(recordId, recordView) {
  console.log('step 1');
  const record = recordView.records[recordId];
  const apiName = record.apiName;

  console.log('step 2');
  const entityEntry = recordView.layouts[apiName];
  const objectInfo = recordView.objectInfos[apiName];

  console.log('step 3');

  let recordType = '012000000000000AAA'; // 'Master'
  if (record.recordTypeInfo) {
    recordType = record.recordTypeInfo.recordTypeId;
  }

  const layouts = {};
  const editValues = {};

  console.log('step 4');

  try {
    const recordTypeRep = entityEntry[Object.keys(entityEntry)[0]]; // TODO: support multiple record types.
    for (const layoutType of Object.keys(recordTypeRep)) {
      const layoutTypeRep = recordTypeRep[layoutType];
      for (const modeType of Object.keys(layoutTypeRep)) {
        const layoutRep = layoutTypeRep[modeType];
        if (!layouts[layoutType]) {
          layouts[layoutType] = {};
        }

        console.log('step 5a');
        const sections = layoutRep.sections.map(section =>
          getLayoutSectionModel(objectInfo, record, recordType, section)
        );

        console.log('step 5b');
        if (modeType === 'Edit') {
          sections.forEach(section =>
            section.rows.forEach(row =>
              row.items.forEach(item =>
                item.values.forEach(
                  value =>
                    (editValues[value.field] = {
                      original: value.value,
                      current: value.value
                    })
                )
              )
            )
          );
        }

        console.log('step 5c');
        layouts[layoutType][modeType] = sections;
      }
    }

    console.log('step 6');
    const result = {
      layouts,
      editValues,
      objectInfo,
      recordId: record.id
    };
    return result;
  } catch (err) {
    console.log(`ERROR CREATING LAYOUT MODEL ${err}`);
    return { layouts: [], editValues: {}, objectInfo: {}, recordId: null };
  }
}

export default {
  getLayoutItemModel,
  getLayoutRowModel,
  getLayoutSectionModel,
  getLayoutModel,
  getLayoutModelForDefaults
};
