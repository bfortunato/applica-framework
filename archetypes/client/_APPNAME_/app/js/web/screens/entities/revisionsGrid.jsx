import React from "react";
import {EntitiesStore} from "../../../stores/entities";
import {connectDiscriminated} from "../../utils/aj";
import AbstractEntitiesGrid from "./abstractEntitiesGrid";
import M from "../../../strings";
import {ActionsMatcher, HeaderBlockWithBreadcrumbs} from "../../components/common";
import entities from "../../entities";
import * as ui from "../../utils/ui";

export default class RevisionsGrid extends AbstractEntitiesGrid {
    constructor(props) {
        super(props)


        this.state.query.eq("entity", props.entity)
        if (props.entityId) {
            this.state.query.eq("entityId", props.entityId)
        }

        this.state.query.sort("date", true)

        this.state.query.on("change", () => {
            this.onQueryChanged()
        })


        this.discriminator = "entity_grid_" + this.getEntity()

        connectDiscriminated(this.discriminator, this, [EntitiesStore])

    }

    generateEntityUrl() {
        return "/entities/" + this.props.entity + "/" + this.props.entityId;
    }

    goBack() {
        ui.navigate(this.generateEntityUrl())
    }


    hideFilters() {
        return true;
    }

    getActions() {
        let defaultActions = [
            {
                id: "back",
                type: "button",
                icon: "zmdi zmdi-arrow-left",
                tooltip: M("back"),
                action: () => {
                    this.goBack()
                }
            }

        ];

        let grid = entities[this.getEntity()].grid
        let matcher = new ActionsMatcher(defaultActions)
        return matcher.match(grid.actions)
    }

    getEntity() {
        return "revision"
    }

    canEdit() {
      return false;
    }

    canCreate() {
      return false;
    }

    canDelete() {
      return false;
    }

    generateTitleItems() {
        let items = [];
        items.push({title: M(this.props.entity), url : this.generateEntityUrl()});
        items.push({title: this.getTitle()});
        return items;
    }

    generateHeaderBlock() {
        let subtitle = this.getSubtitle()
        let title = this.generateTitleItems();
        let actions = this.getActions()

        return <HeaderBlockWithBreadcrumbs title={title} subtitle={subtitle} actions={actions}/>
    }

}

