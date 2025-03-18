const Category = require("../../models/Category");
const { generateIdempotencyKey } = require("../helpers/randomGenerator");

async function createCategory(client, name) {
    try {
        let mongoResponse = await Category.findOne({ name });
        if (!mongoResponse) {
            mongoResponse = await Category.create({ name });
        }

        let { squareId } = mongoResponse;
        if (!squareId) {
            squareId = "#" + generateIdempotencyKey();
            const upsertResponse = await client.catalog.object.upsert({
                idempotencyKey: generateIdempotencyKey(),
                object: {
                    type: "CATEGORY",
                    id: squareId,
                    categoryData: { name },
                    presentAtAllLocations: true,
                },
            });

            if (upsertResponse) {
                squareId = upsertResponse.catalogObject.id;
                mongoResponse.squareId = squareId;
                await mongoResponse.save();
            }
            return upsertResponse;
        }

        const getResponse = await client.catalog.object.get({ objectId: squareId });
        if (getResponse) return getResponse;

        return null;
    } catch (error) {
        console.error("Error in createCategory:", error);
        throw error;
    }
}

async function searchCategory(client, name) {
    const mongoResponse = await Category.findOne({ name });
    if (!mongoResponse)
        return "Category does not exist in the database, use the create endpoint to create a Category in the database";

    const { squareId } = mongoResponse;
    if (!squareId)
        return "Category does not exist in Square, use the create endpoint to create a Category in Square";

    const getResponse = await client.catalog.object.get({ objectId: squareId });
    if (getResponse) return getResponse;

    return null;
}

async function deleteCategory(client, name) {
    try {
        const categoryData = await searchCategory(client, name);
        if (!categoryData || !categoryData.object || !categoryData.object.id) {
            console.error("Category not found in Square");
            return "Category not found in Square. Ensure it exists before trying to delete.";
        }

        const squareId = categoryData.object.id;
        const deleteResponse = await client.catalog.object.delete({ objectId: squareId });

        await Category.deleteOne({ name });
        return deleteResponse;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}

async function updateCategory(client, name, newName) {
    try {
        const mongoResponse = await Category.findOne({ name });
        if (!mongoResponse) {
            return "Category not found in database. Ensure it exists before trying to update.";
        }

        const { squareId } = mongoResponse;
        if (!squareId) {
            return "Category not found in Square. Ensure it exists before trying to update.";
        }

        const retrieveResponse = await client.catalog.object.get({ objectId: squareId });
        if (!retrieveResponse || !retrieveResponse.object) {
            return "Failed to retrieve category from Square.";
        }
        const currentVersion = retrieveResponse.object.version;

        const upsertResponse = await client.catalog.object.upsert({
            idempotencyKey: generateIdempotencyKey(),
            object: {
                type: "CATEGORY",
                id: squareId,
                version: currentVersion,
                categoryData: { name: newName },
                presentAtAllLocations: true,
            },
        });

        if (upsertResponse) {
            mongoResponse.name = newName;
            mongoResponse.squareId = upsertResponse.catalogObject.id;
            await mongoResponse.save();
            return upsertResponse;
        }

        return null;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}

module.exports = {
    createCategory,
    searchCategory,
    deleteCategory,
    updateCategory,
};
