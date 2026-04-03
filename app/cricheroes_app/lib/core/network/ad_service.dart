import 'package:flutter/material.dart';

class AdService {
  static void showInterstitialAd() {
    print("Showing Interstitial Ad");
  }

  static void showRewardedAd(Function onReward) {
    print("Showing Rewarded Ad");
    onReward();
  }

  static Widget getBannerAd() {
    return Container(
      height: 50,
      width: double.infinity,
      color: Colors.grey[200],
      child: const Center(child: Text('ADVERTISEMENT (Banner)')),
    );
  }
}
