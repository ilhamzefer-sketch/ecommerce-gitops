package az.ilham.ecommerceauth.user.service;

import az.ilham.ecommerceauth.user.entity.ShopAction;
import az.ilham.ecommerceauth.user.entity.ShopMemberRole;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.Set;

@Service
public class ShopAuthorizationService {

    public Set<ShopAction> resolveActions(ShopMemberRole membershipRole) {
        return switch (membershipRole) {
            case OWNER -> EnumSet.of(
                    ShopAction.SHOP_VIEW,
                    ShopAction.MEMBERS_VIEW,
                    ShopAction.MEMBERS_MANAGE,
                    ShopAction.INVITES_VIEW,
                    ShopAction.INVITES_MANAGE,
                    ShopAction.LISTINGS_MANAGE,
                    ShopAction.OWNERSHIP_TRANSFER
            );
            case MANAGER -> EnumSet.of(
                    ShopAction.SHOP_VIEW,
                    ShopAction.MEMBERS_VIEW,
                    ShopAction.MEMBERS_MANAGE,
                    ShopAction.INVITES_VIEW,
                    ShopAction.INVITES_MANAGE,
                    ShopAction.LISTINGS_MANAGE
            );
            case LISTING_MANAGER -> EnumSet.of(
                    ShopAction.SHOP_VIEW,
                    ShopAction.MEMBERS_VIEW,
                    ShopAction.INVITES_VIEW,
                    ShopAction.LISTINGS_MANAGE
            );
            case STAFF -> EnumSet.of(
                    ShopAction.SHOP_VIEW,
                    ShopAction.MEMBERS_VIEW
            );
        };
    }

    public boolean canManageMembers(ShopMemberRole membershipRole) {
        return resolveActions(membershipRole).contains(ShopAction.MEMBERS_MANAGE);
    }

    public boolean canManageInvites(ShopMemberRole membershipRole) {
        return resolveActions(membershipRole).contains(ShopAction.INVITES_MANAGE);
    }

    public boolean canTransferOwnership(ShopMemberRole membershipRole) {
        return resolveActions(membershipRole).contains(ShopAction.OWNERSHIP_TRANSFER);
    }
}
