---
name: Update DMC Marketplace Diagram Structure
overview: "Update the dmc-drmigrate-marketplace.drawio diagram to: (1) Position Azure Migrate Project inside the Managed Resource Group (MRG) with proper labeling, (2) Add connection showing VM's Managed Identity manages Azure Migrate Project lifecycle, (3) Add DMC icon to jumpboxes, and (4) Add dotted line showing file copy flow from jumpbox to DRM system (Dr Migrate VM)."
todos:
  - id: reposition_azure_migrate
    content: Reposition Azure Migrate Project to be clearly inside the Managed Resource Group (MRG) area
    status: completed
  - id: add_managed_identity_connection
    content: Add connection from Dr Migrate VM to Azure Migrate Project showing Managed Identity manages the project lifecycle
    status: completed
  - id: add_dmc_icons
    content: Add DMC icons to both jumpboxes on the on-premises side
    status: completed
  - id: add_file_copy_flow
    content: Add dotted line connection showing file copy flow from jumpbox to Dr Migrate VM (DRM system)
    status: completed
---

# Update DMC Marketplace Diagram Structure

## Changes Required

### Azure Side Updates

1. **Azure Migrate Project positioning in MRG**

- Move Azure Migrate Project (cell `15xGl-hSoTpWF-k299Dp-14`) to be clearly positioned within the Managed Resource Group area
- Ensure it's visually contained within the MRG boundary (currently labeled "DrMigrate-Managed-Resourece-Group" at cell `15xGl-hSoTpWF-k299Dp-18`)
- Adjust coordinates to place it inside the MRG container area

2. **VM Managed Identity connection**

- Add a connection/arrow from the Dr Migrate VM (cell `15xGl-hSoTpWF-k299Dp-8`) to the Azure Migrate Project
- Use appropriate arrow style to indicate management/creation relationship
- Add label indicating "Managed Identity creates/manages" or similar text
- Style the connection to show lifecycle management responsibility

### On-Premises Side Updates

3. **Add DMC icon to jumpboxes**

- Add DMC icon/image to the first jumpbox (cell `15xGl-hSoTpWF-k299Dp-45` at coordinates 770, 317.2)
- Add DMC icon/image to the second jumpbox (cell `15xGl-hSoTpWF-k299Dp-48` at coordinates 780, 479.2)
- Use the DMC icon file located at `/Users/adambrown/Developer/Altra/drm-diagrams/dmc/DrmIcon.ico`
- Convert .ico to base64 or use appropriate image format for draw.io (may need to reference as data URI or convert format)

4. **File copy flow to DRM system**

- Add dotted line connection from jumpbox(es) to the Dr Migrate VM in Azure (cell `15xGl-hSoTpWF-k299Dp-8`)
- Use dashed/dotted line style (`dashed=1` or `dashPattern`)
- Add label indicating file copy/transfer
- Ensure the connection crosses the on-prem to Azure boundary appropriately

## Implementation Details

- File to modify: `/Users/adambrown/Developer/Altra/drm-diagrams/dmc/dmc-drmigrate-marketplace.drawio`
- Format: XML-based draw.io format
- Key cells to modify:
- `15xGl-hSoTpWF-k299Dp-14`: Azure Migrate Project (reposition)
- `15xGl-hSoTpWF-k299Dp-8`: Dr Migrate VM (add connection from)
- `15xGl-hSoTpWF-k299Dp-45`, `15xGl-hSoTpWF-k299Dp-48`: Jumpboxes (add DMC icons)
- New cells: Connection for Managed Identity, connection for file copy flow

## Technical Notes

- Draw.io uses mxCell elements with geometry coordinates
- Connections use edge elements with source/target cell IDs
- Icons can be added using image elements with `shape=image` and `image` attribute pointing to the icon file
- The DMC icon file is located at `/Users/adambrown/Developer/Altra/drm-diagrams/dmc/DrmIcon.ico`
- May need to convert .ico to PNG or use base64 data URI format for draw.io compatibility
- Dotted lines use `dashed=1` and `dashPattern` attributes