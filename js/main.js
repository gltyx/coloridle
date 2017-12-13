$(document).on("click", '[data-tab="true"]', function (t) {
    t.preventDefault();
    var e = $($(this).attr("href"));
    e.parent().children(".active").removeClass("active"), e.addClass("active"), $(this).closest("ul").find('[data-tab="true"].active').removeClass("active"), $(this).addClass("active")
}), $.fn.highlightElement = function (t) {
    var e = {
        show: function () {
            $(this).css({
                "z-index": "999",
                position: "relative",
                "background-color": "#fff"
            }), 0 == $("#overlay-highlight").length && $('<div id="overlay-highlight"></div>').appendTo("body"), $("#overlay-highlight").fadeIn(300), $(this).trigger("highlighted")
        },
        hide: function () {
            var t = this;
            $("#overlay-highlight").fadeOut(300, function () {
                $(t).css({
                    "z-index": "1",
                    "background-color": "inherit"
                })
            })
        }
    };
    return e[t] ? e[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void $.error("未知方法 " + t) : e.show.apply(this, arguments)
}, $(function () {
    function t(t) {
        var e = this;
        this.game = t, this.timeThisSession = 0, this.timeSinceReset = 0, this.allTime = 0, this.timeOnline = 0, this.timeOffline = 0, this.dateTime = new Date, this.passedOfflineTime = 0, this.init = function () {
            this.initTimer()
        }, this.initTimer = function () {
            setInterval(function () {
                e.tick()
            }, 1e3)
        }, this.tick = function () {
            this.timeThisSession += 1, this.timeSinceReset += 1, this.timeOnline += 1, this.allTime += 1, this.setText()
        }, this.setText = function () {
            $('[data-time="thisSession"]').text(this.toFormat(this.timeThisSession)), $('[data-time="sinceReset"]').text(this.toFormat(this.timeSinceReset)), $('[data-time="all"]').text(this.toFormat(this.allTime)), $('[data-time="online"]').text(this.toFormat(this.timeOnline)), $('[data-time="offline"]').text(this.toFormat(this.timeOffline))
        }, this.toFormat = function (t) {
            var e = "",
                i = t % 60,
                s = Math.floor(t / 60) % 60,
                a = Math.floor(t / 3600) % 24,
                r = Math.floor(t / 86400) % 30,
                n = Math.floor(t / 2592e3) % 12,
                o = Math.floor(t / 31104e3);
            return e += o ? o + " 年 " : "", e += n || o ? n + " 月 " : "", e += r || n ? r + " 天 " : "", e += a || r ? a + " 时 " : "", e += s || a ? s + " 分 " : "", e += i + " 秒"
        }, this.toJson = function () {
            return {
                sinceReset: e.timeSinceReset,
                all: e.allTime,
                online: e.timeOnline,
                offline: e.timeOffline,
                dateTime: new Date
            }
        }, this.fromJson = function (t) {
            e.timeSinceReset = t.sinceReset, e.allTime = t.all, e.timeOnline = t.online, e.timeOffline = t.offline;
            var i = new Date(t.dateTime);
            e.passedOfflineTime = Math.floor(Math.abs(e.dateTime - i.getTime()) / 1e3), e.timeOffline += e.passedOfflineTime, e.allTime += e.timeOffline
        }, this.offlineBonus = function () {
            var t = e.passedOfflineTime;
            if (t < 60) return new BigNumber(0);
            t > 2592e3 && (t = 2592e3);
            var i = Math.floor(e.game.statVars.getTickTime() / 1e3),
                s = 0;
            if ($.each(e.game.jqueryWorkCells("color"), function () {
                    s += parseInt(e.game.jqueryGetTier($(this)))
                }), s > 0) {
                var a = Math.floor(s / e.game.jqueryWorkCells("color").length),
                    r = e.game.getColorValue(a),
                    n = Math.floor(t / i / 2);
                return new BigNumber(r).times(n)
            }
            return new BigNumber(0)
        }, this.reset = function () {
            this.timeSinceReset = 0
        }
    }

    function e(t) {
        var i = this;
        this.game = t, this.talents = t.talents, this.upgrades = t.upgrades, this._money = new BigNumber(0), this._allMoney = new BigNumber(0), this._goldPaint = new BigNumber(0), this._allGoldPaint = new BigNumber(0), this._highestTier = 0, this.highestTierLastReset = new BigNumber(0), this._resetCount = new BigNumber(0), this.bonusGoldPaint = 0, this.initStats = function () {
            this.money = new BigNumber(0), this.allMoney = new BigNumber(0), this.highestTier = 0, this.goldPaint = new BigNumber(0), this.allGoldPaint = new BigNumber(0), this.highestTierLastReset = 0, this.resetCount = new BigNumber(0)
        }, this.toKongStat = function (t, e) {
            "undefined" != typeof kongregate && kongregate.stats.submit(t, parseInt(e))
        }, this.getBaseColor = function () {
            return this.talents.getEffect("base_color")
        }, this.getMaxTier = function () {
            return 16777
        }, this.getTickTime = function () {
            return 7e3 * this.upgrades.getEffect("time") + 3e3
        }, this.getGoldPaintAfter = function () {
            var t = parseInt(this.bonusGoldPaint);
            return Math.ceil(this.getHighestTierThisReset() / 10 + t)
        }, this.getHighestTierThisReset = function () {
            return i.highestTier - i.highestTierLastReset
        }, this.getAllGoldPaintExtra = function () {
            return new BigNumber(.05).times(i.allGoldPaint).plus(1)
        }, this.setTextMoney = function () {
            $("#money").text(e.displayNumber(this.money) + "$")
        }, this.setTextGoldPaint = function () {
            var t = "";
            t += e.displayNumber(i.goldPaint);
            var s = i.getGoldPaintAfter();
            t += "/", t += e.displayNumber(s), $('[data-stat="goldPaint"]').text(e.displayNumber(i.goldPaint)), $('[data-stat="goldPaintAfterReset"]').text(e.displayNumber(s)), $("#gold_paint").html(t)
        }, this.setTextHighestTier = function () {
            $('[data-stat="highestTier"]').text(e.displayNumber(i.highestTier)), $('[data-stat="highestTierThisReset"]').text(e.displayNumber(this.getHighestTierThisReset())), this.game.canReset() ? $("#reset").removeClass("disabled") : $("#reset").addClass("disabled")
        }, this.setTextResetCount = function () {
            $('[data-stat="resetCount"]').text(e.displayNumber(i.resetCount));
            var t = "当您获得至少100个颜色层时，您可以重置";
            i.resetCount.greaterThan(0) && (t = "当你得到至少1金漆，你可以重置"), $("#reset").tooltip("dispose"), $("#reset").attr("data-original-title", t), $("#reset").tooltip({
                trigger: "hover"
            })
        }, this.setTextAllGoldPaint = function () {
            $('[data-stat="allGoldPaint"]').text(e.displayNumber(i.allGoldPaint)), $('[data-stat="allGoldPaintExtra"]').text(e.displayNumber(i.getAllGoldPaintExtra().minus(1).times(100)))
        }, this.setTextAllMoney = function () {
            $('[data-stat="allMoney"]').text(e.displayNumber(i.allMoney))
        }, this.setButtons = function () {
            i.talents.getEffect("paint_auto_sort") && $("#auto-sort-work-grid").removeClass("hidden"), i.talents.getEffect("palette_auto_sort") && $("#auto-sort-desk-grid").removeClass("hidden")
        }, this.updateTick = function () {
            var t = this.getTickTime();
            $("#tick-time").text(parseInt(t)), i.game.updateTimerTick(t)
        }, this.toJson = function () {
            return {
                money: i.money,
                allMoney: i.allMoney,
                highestTier: i.highestTier,
                highestTierLastReset: i.highestTierLastReset,
                goldPaint: i.goldPaint,
                allGoldPaint: i.allGoldPaint,
                resetCount: i.resetCount,
                bonusGoldPaint: i.bonusGoldPaint
            }
        }, this.fromJson = function (t) {
            i.money = t.money, i.allMoney = t.allMoney ? t.allMoney : 0, i.highestTier = t.highestTier, i.highestTierLastReset = t.highestTierLastReset, i.goldPaint = t.goldPaint, i.allGoldPaint = t.allGoldPaint, i.resetCount = t.resetCount, i.bonusGoldPaint = t.bonusGoldPaint ? t.bonusGoldPaint : 0, this.setTextHighestTier(), this.setTextGoldPaint()
        }, this.clear = function () {
            this.initStats()
        }, this.reset = function () {
            if (this.money = new BigNumber(0), this.goldPaint = this.goldPaint.plus(this.getGoldPaintAfter()), this.allGoldPaint = this.allGoldPaint.plus(this.goldPaint), this.highestTierLastReset = this.highestTier, this.resetCount = this.resetCount.plus(1), this.bonusGoldPaint = 0, 1 == this.resetCount) {
                var t = this.talents.getByName("paint_cells_active");
                t.level += 1, t.upgrade(), i.talents.updateText(t)
            }
            this.setTextHighestTier(), this.setTextGoldPaint()
        }
    }

    function i(t) {
        var e = this;
        this.game = t, this.instructions = {
            colors: {
                step: 1,
                steps: {
                    1: {
                        target: $("#timer-wrapper"),
                        text: "这是一个计时器，当它结束时一个新的颜色会生成。"
                    },
                    2: {
                        target: $("#work-grid"),
                        text: '这是你的“画板”。<br /> 计时器产生的新颜色将取决于“画板”中的颜色。 <br />颜色有一个十六进制代码和层次，更大层次，更好的色彩。'
                    },
                    3: {
                        target: $("#desk-grid"),
                        text: '这是你的“调色板”。 <br /> 计时器产生的新颜色将出现在这里。 <br /> 如果它们的颜色层多于“画板”中的颜色层，则需要拖放（在“画板”中单元格为空的情况下将新颜色）拖放到“画板”上（如果你的浏览器不支持鼠标拖放，请尝试双击鼠标左键，或者使用谷歌、火狐浏览器进行游戏）。 <br />你可以卖掉最小数字的颜色层。'
                    },
                    4: {
                        target: $("#upgrades"),
                        text: "这些是你的升级。 你可以升级计时器，几率和金钱。"
                    },
                    5: {
                        target: $("#probabilities"),
                        text: "这是获取颜色层的几率的信息。 <br />你玩的时间越长，得到一个新的颜色层就越困难。<br />但在游戏中有很多方法来增加几率。",
                        place: "top"
                    }
                }
            },
            gallery: {
                step: 1,
                steps: {
                    1: {
                        target: $("#gallery"),
                        text: "这是你的画廊。 <br />你得到的所有颜色都可以在这里找到。 <br />当你点击任何颜色，你可以得到有关它的详细信息。"
                    }
                }
            },
            talents: {
                step: 1,
                steps: {
                    1: {
                        target: $("#talents .info"),
                        text: "你可以重置游戏并获得金漆。 <br />在这里你可以找到关于它的所有信息。 <br />当徘徊在一些价值观上，你可以得到关于他们的暗示。"
                    },
                    2: {
                        target: $("#talents .talents"),
                        text: "这是你的天赋树。 <br />你可以花费金漆来提升天赋。 <br />当你徘徊在每个天赋，你会收到有关它的详细信息。",
                        place: "top"
                    }
                }
            }
        }, this.start = function (t) {
            if (this.game.options.hints) {
                var e = this.instructions[t];
                this.generate(e)
            }
        }, this.next = function (t) {
            this.hide(t), t.step = parseInt(t.step + 1), this.generate(t)
        }, this.close = function (t) {
            this.hide(t), t.step = 0
        }, this.disable = function (t) {
            this.close(t), this.game.options.hints = !1
        }, this.hide = function (t) {
            t.steps[t.step].target.highlightElement("hide"), $(".highlight-text").remove(), $(".highlight-btn-wrapper").remove()
        }, this.generate = function (t) {
            var i = t.step;
            if (0 != i) {
                var s = t.steps[i],
                    a = s.target;
                a.highlightElement();
                var r = s.hasOwnProperty("place") ? s.place : "bot",
                    n = $("<div/>").addClass("highlight-text").html(s.text).appendTo(".container").css({
                        left: a.offset().left
                    }).fadeIn(300);
                if ("bot" == r) o = a.offset().top + a.height() + 10;
                else var o = a.offset().top - n.outerHeight() - 10;
                n.css("top", o);
                var l = $("<div/>").addClass("highlight-btn-wrapper");
                $("<button/>").addClass("btn btn-danger").text("禁用所有说明").appendTo(l).on("click", function () {
                    e.disable(t)
                }), t.steps.hasOwnProperty(parseInt(i + 1)) && $("<button/>").addClass("btn btn-primary").text("下一步 >").appendTo(l).css({
                    float: "right",
                    "margin-left": "15px"
                }).on("click", function () {
                    e.next(t)
                }), $("<button/>").addClass("btn btn-warning").text("关闭").appendTo(l).css({
                    float: "right"
                }).on("click", function () {
                    e.close(t)
                }), l.appendTo("body").fadeIn(300)
            }
        }, this.toJson = function () {
            var t = {};
            return $.each(e.instructions, function (e, i) {
                t[e] = i.step
            }), t
        }, this.fromJson = function (t) {
            $.each(t, function (t, i) {
                e.instructions[t].step = i
            })
        }
    }

    function s() {
        this.autoSave = !0, this.upgrades = new a(this), this.gallery = new n(this), this.talents = new r(this), this.statVars = new e(this), this.time = new t(this), this.instruction = new i(this), this.timer = null, this.timerI = 0, this.colorView = 1, this.probValueMulti = 1.06, this.probCostMulti = 1.11, this.colorMulti = 1.04, this.events = {}, this._probabilities = [], this.options = {
            hints: !0,
            galleryShowTier: !1,
            colorView: 1,
            theme: ""
        };
        var s = this;
        this.start = function () {
            this.isLoadGame() ? (this.statVars.initStats(), this.upgrades.init(), this.talents.init(), this.loadGame(), this.gallery.init(), this.time.init(), this.offlineBonus()) : (this.statVars.initStats(), this.doWorkGrid(), this.doDeskGrid(), this.doStartColor(), this.upgrades.init(), this.gallery.init(), this.talents.init(), this.time.init(), this.updateProbabilities(), this.setEvents()), this.instruction.start("colors"), s.statVars.updateTick(), this.raiseEvent("moneyChange"), this.raiseEvent("goldPaintChange"), this.autoSave()
        }, this.offlineBonus = function () {
            var t = s.time.offlineBonus();
            t.greaterThan(0) && (s.statVars.money = s.statVars.money.plus(t), confirmModal({
                content: "You received an offline bonus " + e.displayNumber(t),
                confirmButtonText: "Ok",
                cancelButton: !1
            }))
        }, this.jqueryColorCells = function (t, e, i) {
            i = void 0 !== i && i;
            var s = t.find(".grid-cell").not(".ui-draggable-dragging");
            if (e || void 0 === e) var a = s.filter(function () {
                if (!($(this).data("type") != e || i && $(this).data("activeCell"))) return !0
            });
            else a = s;
            return a
        }, this.jqueryWorkGrid = function () {
            return $("#work-grid")
        }, this.jqueryDeskGrid = function () {
            return $("#desk-grid")
        }, this.jqueryWorkCells = function (t) {
            return this.jqueryColorCells(this.jqueryWorkGrid(), t)
        }, this.jqueryDeskCells = function (t, e) {
            return this.jqueryColorCells(this.jqueryDeskGrid(), t, e)
        }, this.doStartColor = function () {
            this.setDeskColorCell(1, {
                tier: this.statVars.getBaseColor()
            })
        }, this.doWorkGrid = function () {
            this.doGrid(this.jqueryWorkGrid(), 5 + s.talents.getEffect("paint_cells_count"))
        }, this.doDeskGrid = function () {
            this.doGrid(this.jqueryDeskGrid(), 4 + s.talents.getEffect("palette_cells_count"))
        }, this.clear = function () {
            this.jqueryDeskGrid().empty(), this.jqueryWorkGrid().empty(), this.statVars.clear(), this.upgrades && this.upgrades.clear(), this.updateProbabilities()
        }, this.reset = function () {
            $.each(this.jqueryWorkCells(null), function () {
                s.clearCell($(this))
            }), $.each(this.jqueryDeskCells(null), function () {
                s.clearCell($(this))
            }), this.statVars.reset(), this.time.reset(), this.upgrades && this.upgrades.clear(), this.talents.updateAllTexts(), this.updateProbabilities(), this.doStartColor()
        }, this.decimalToHex = function (t, e) {
            if (2 == this.options.colorView) {
                t < 30 && (t += 30);
                var i = t > 255 ? 255 : t,
                    s = Math.floor(Math.random() * (i - 0) + 0),
                    a = Math.floor(Math.random() * (t - s)),
                    r = t - s - a;
                return s = s.toString(16), a = a.toString(16), r = r.toString(16), s.length < 2 && (s = "0" + s), a.length < 2 && (a = "0" + a), r.length < 2 && (r = "0" + r), n = s + a + r
            }
            1 == this.options.colorView && (t *= 1e3);
            var n = Number(t).toString(16);
            for (e = void 0 === e || null === e ? e = 6 : e; n.length < e;) n = "0" + n;
            if (1 == this.options.colorView) return n;
            var o = n.split("");
            return o[0] = o[3], o[3] = 0, o[2] = o[4], o[4] = 0, o[4] = o[5], o[5] = 0, o.join("")
        }, this.setTextProbabilities = function () {
            var t = $("#probabilities");
            t.html("");
            var i = 0,
                s = this.probabilities;
            (s = s.slice(0)).sort(function (t, e) {
                return "asc" == $("#probabilities-sort").attr("data-sort") ? t.probability - e.probability : e.probability - t.probability
            });
            for (var a in s) {
                if (i >= 24) break;
                var r = s[a],
                    n = $("<div/>").addClass("probability").text("层 " + r.key + ": " + e.displayNumber(r.probability.times(100)) + "%").appendTo(t);
                this.setColorCss(n, r.key), i++
            }
        }, this.getProbCostExtra = function () {
            return 1
        }, this.getProbCostWithoutExtra = function (t) {
            return new BigNumber(this.probCostMulti).pow(t).times(100)
        }, this.getProbCost = function (t) {
            return new BigNumber(this.getProbCostWithoutExtra(t)).times(this.getProbCostExtra())
        }, this.getProbValueExtra = function () {
            return new BigNumber(this.upgrades.getEffect("chance").toExponential(15)).times(this.talents.getEffect("probability").toExponential(15)).times(this.statVars.getAllGoldPaintExtra().toExponential(15))
        }, this.getProbValueWithoutExtra = function (t) {
            return new BigNumber(this.probValueMulti).pow(t).plus(2).times(10)
        }, this.getProbValue = function (t) {
            return new BigNumber(this.getProbValueWithoutExtra(t)).times(this.getProbValueExtra())
        }, this.getColorValueExtra = function () {
            return new BigNumber(this.upgrades.getEffect("money").toExponential(15))
        }, this.getColorValueWithoutExtra = function (t) {
            return new BigNumber(this.colorMulti).pow(t).plus(1).times(500)
        }, this.getColorValue = function (t) {
            return new BigNumber(this.getColorValueWithoutExtra(t)).times(this.getColorValueExtra())
        }, this.jqueryGetTier = function (t) {
            var e = t.data("colorData");
            return e ? e.tier : -1
        }, this.jqueryGetColorAmount = function (t) {
            var e = t.data("colorData");
            return e && e.amount ? parseInt(e.amount) : e ? 1 : -1
        }, this.updateProbabilities = function () {
            var t = {},
                e = 0,
                i = 0,
                a = {},
                r = s.talents.getEffect("paint_tier_same");
            $.each(this.jqueryWorkCells("color"), function () {
                var t = s.jqueryGetTier($(this)),
                    e = s.jqueryGetColorAmount($(this));
                a.hasOwnProperty(t) ? a[t] += e : a[t] = e, t > i && (i = t)
            }), $.each(a, function (i, n) {
                a[i] = n;
                var o = s.getProbValue(i),
                    l = ((2 + (r - 1) * (n - 1)) / 2 * n).toExponential(2),
                    c = new BigNumber(o).times(l);
                t[i] = c, e = new BigNumber(e).plus(c)
            });
            var n = {};
            if (n[0] = new BigNumber(100), Object.keys(t).length > 0) {
                var o = 0,
                    l = new BigNumber(e).times(1e5),
                    c = Math.log(10) / Math.log(this.probCostMulti) * l.e;
                i + 1 > c && (i = Math.ceil(c), $.each(t, function (t, e) {
                    t > c - 1 && (o = new BigNumber(o).plus(e))
                })), (i += s.talents.getEffect("color_tier_count")) > s.statVars.getMaxTier() && (i = s.statVars.getMaxTier());
                for (var h = i + 1; h > 0; h--) {
                    $.each(t, function (t, e) {
                        t == h - 1 - s.talents.getEffect("color_tier_count") && (o = new BigNumber(o).plus(e))
                    });
                    var u = s.getProbCost(h);
                    if (!new BigNumber(o).div(u).lessThan(new BigNumber(1e-4)) && (n[h] = o, new BigNumber(o).greaterThanOrEqualTo(u))) {
                        delete n[0];
                        break
                    }
                }
            }
            var d = Object.keys(n).sort(function (t, e) {
                    return e - t
                }),
                f = [];
            for (var g in d) {
                var m = parseInt(d[g]),
                    p = n[m].div(s.getProbCost(m));
                p.greaterThan(1) && (p = new BigNumber(1)), f.push({
                    key: m,
                    probability: p
                })
            }
            this.probabilities = f
        }, this.progressTick = function () {
            for (var t = parseInt(this.talents.getEffect("tick_color_count")) + 1, e = 1; e <= t; e++) {
                var i = 1;
                if (Math.random() <= .05) {
                    i = 5, $("#timer-wrapper").addClass("crit");
                    var a = $("<span/>").text(" 暴击!").insertBefore("#color-progress");
                    setTimeout(function () {
                        a.remove(), $("#timer-wrapper").removeClass("crit")
                    }, 1500)
                }
                for (var r in this.probabilities) {
                    var n = this.probabilities[r],
                        o = Math.random();
                    if (new BigNumber(n.probability).times(i).greaterThanOrEqualTo(o.toExponential(15))) {
                        (!this.statVars.highestTier || this.statVars.highestTier < n.key) && (this.statVars.highestTier = n.key);
                        var l = s.getStackCell(s.jqueryDeskGrid(), n.key),
                            c = s.jqueryDeskCells(void 0).first();
                        if (l) s.addAmount(l, 1), s.raiseEvent("newColor", [c]);
                        else if (c.length > 0) this.setColorCell(c, {
                            tier: n.key
                        }), s.raiseEvent("newColor", [c]);
                        else {
                            if (s.talents.getEffect("auto_seller_smart")) h = s.sortCellsByTier(s.jqueryDeskCells(null)).last();
                            else var h = s.jqueryDeskCells(null).last();
                            this.sellColor(h, !0), this.setColorCell(h, {
                                tier: n.key
                            }), s.raiseEvent("newColor", [h])
                        }
                        s.raiseEvent("tickTime");
                        break
                    }
                }
            }
        }, this.updateTimerTick = function (t) {
            this.timer && clearInterval(this.timer);
            var e = 100 / (t / 5);
            this.timer = setInterval(function () {
                s.timerI += e, $("#color-progress .progress-bar").css("width", s.timerI + "%"), s.timerI >= 100 && (s.timerI = 0, s.progressTick())
            }, 5)
        }, this.jquerySetDraggable = function (t) {
            t.draggable({
                cancel: "a.ui-icon",
                revert: "invalid",
                helper: "clone",
                cursor: "move",
                delay: 150,
                start: function (t, e) {
                    if (!e.helper.hasClass("active")) return !1
                }
            }), t.droppable({
                revert: "invalid",
                drop: function (t, e) {
                    $(e.helper).remove(), s.swapCells(e.draggable, $(t.target))
                }
            })
        }, this.setEvents = function () {
            var t = this;
            $(document).on("dblclick", "#desk-grid .grid-cell", function (e) {
                e.preventDefault(), t.moveColorDeskToWork($(this))
            }), $("#desk-grid .grid-cell, #work-grid .grid-cell").click(function (e) {
                e.shiftKey && t.sellColor($(this))
            }), $(document).on("dblclick", "#work-grid .grid-cell", function (e) {
                e.preventDefault(), t.moveColorWorkToDesk($(this))
            }), $("#sell-all").click(function () {
                t.jqueryDeskCells("color").each(function () {
                    t.sellColor($(this))
                })
            }), $(document).on("click", ".grid-cell .sell", function () {
                t.sellColor($(this).closest(".grid-cell"))
            }), $("#sort-desk-grid").click(function () {
                t.talents.getEffect("palette_sort") && t.sortDeskColors()
            }), $("#sort-work-grid").click(function () {
                t.talents.getEffect("paint_sort") && t.sortWorkColors()
            }), $("#export-button").click(function () {
                $("#export-text").val(t.export()), $("#export-text").select()
            }), $("#import-button").click(function () {
                t.import($("#import-text").val())
            }), $("#save-button").click(function () {
                t.saveGame()
            }), $("#delete-save-button").click(function () {
                confirm("您确定要删除所有游戏进度吗？") && (t.deleteSave(), alert("您已成功删除整个保存的日期，刷新页面以开始新的游戏"))
            }), $("#probabilities-sort a").click(function () {
                $("#probabilities-sort").attr("data-sort", $(this).attr("data-sort")).find("button").html($(this).html()), t.setTextProbabilities()
            }), $("#auto-sort-work-grid").click(function () {
                t.talents.getEffect("paint_auto_sort") && ($(this).data("enabled") ? ($(this).data("enabled", !1), $(this).text($(this).data("disabled-text"))) : ($(this).data("enabled", !0), $(this).text($(this).data("enabled-text"))))
            }), $("#auto-sort-desk-grid").click(function () {
                t.talents.getEffect("palette_auto_sort") && ($(this).data("enabled") ? ($(this).data("enabled", !1), $(this).text($(this).data("disabled-text"))) : ($(this).data("enabled", !0), $(this).text($(this).data("enabled-text"))))
            }), $(document).on("mouseover", ".grid-cell:not(.ui-draggable-dragging) .sell", function () {
                var i = $(this).closest(".grid-cell");
                $(this).attr("data-original-title", "出售可以获得 " + e.displayNumber(t.getColorValue(t.jqueryGetTier(i))) + "$"), $(this).tooltip("show")
            }), $("#reset").click(function () {
                !$(this).hasClass(".disabled") && t.canReset() && confirm("你确定要重置？ 这将游戏中的所有的值返回到原来的，除了天赋和金漆，你也将获得 " + t.statVars.getGoldPaintAfter() + " 金漆。") && t.reset()
            }), $("#color-view").change(function () {
                t.options.colorView = $(this).val(), $.each(t.jqueryWorkCells("color"), function () {
                    t.setColorCss($(this), t.jqueryGetTier($(this))), t.setTextColorCell($(this))
                }), $.each(t.jqueryDeskCells("color"), function () {
                    t.setColorCss($(this), t.jqueryGetTier($(this))), t.setTextColorCell($(this))
                })
            }), $("#change-theme").change(function () {
                var e = $(this).val();
                t.options.theme = e, e ? $("body").addClass(e) : $("body").removeClass()
            }), t.subscribeToEvent("onTickTime", function () {
                t.talents.getEffect("palette_auto_sort") && $("#auto-sort-desk-grid").data("enabled") && t.sortDeskColors()
            }), t.subscribeToEvent("onSwapCells", function (e, i) {
                t.talents.getEffect("paint_auto_sort") && $("#auto-sort-work-grid").data("enabled") && (e.closest("#work-grid").length > 0 || i.closest("#work-grid").length > 0) && t.sortWorkColors(), t.talents.getEffect("palette_auto_sort") && $("#auto-sort-desk-grid").data("enabled") && (e.closest("#desk-grid").length > 0 || i.closest("#desk-grid").length > 0) && t.sortDeskColors()
            }), t.subscribeToEvent("onHighestTierChange", function (e, i) {
                0 == t.statVars.resetCount && 99 == e && confirmModal({
                    content: '你已经可以重置了。 <br />建议您尽快进行第一次重置，因为您将免费获得“绘制活动”的天赋，这将使游戏更加轻松',
                    confirmButtonText: "前往重置页面",
                    confirmCallback: function () {
                        $("#main-menu li").eq(2).children("a").trigger("click")
                    }
                })
            })
        }, this.canReset = function () {
            return s.statVars.resetCount > 0 ? s.statVars.getGoldPaintAfter() > 0 : s.statVars.highestTier >= 100
        }, this.sellColor = function (t, e) {
            e = void 0 !== e;
            var i = this.getColorValue(this.jqueryGetTier(t)).times(s.jqueryGetColorAmount(t));
            e && (i = i.times(1)), s.statVars.money = s.statVars.money.plus(i), s.statVars.allMoney = s.statVars.allMoney.plus(i), this.clearCell(t)
        }, this.swapCells = function (t, e) {
            if (0 != t.length && 0 != e.length && !s.stackCells(t, e)) {
                var i = t.data("colorData"),
                    a = e.data("colorData"),
                    r = s.jqueryGetTier(e); - 1 !== s.jqueryGetTier(t) && (this.setColorCell(e, i), -1 != r ? this.setColorCell(t, a) : this.clearCell(t), (t.closest("#work-grid").length > 0 && e.closest("#desk-grid").length > 0 || t.closest("#desk-grid").length > 0 && e.closest("#work-grid").length > 0) && this.updateProbabilities(), s.raiseEvent("swapCells", [t, e]))
            }
        }, this.addAmount = function (t, e) {
            var i = t.data("colorData");
            t.data("colorData", $.extend(i, {
                amount: parseInt(i.amount) + 1
            })), s.setTextColorCell(t)
        }, this.getStackCell = function (t, e) {
            var i = !1;
            return $.each(t.find(".grid-cell.active"), function () {
                var t = $(this).data("colorData");
                if (t && t.tier == e) {
                    var a = s.talents.getEffect("paint_cells_stack") + 1;
                    if (t.amount < a) return i = $(this), !1
                }
            }), i
        }, this.stackCells = function (t, e) {
            var i = t.data("colorData"),
                a = e.data("colorData"),
                r = s.talents.getEffect("paint_cells_stack") + 1;
            if (!i || !a || i.tier != a.tier || i.amount >= r || a.amount >= r) return !1;
            var n = i.amount + a.amount,
                o = n,
                l = 0;
            return n > r && (l = n - (o = r)), o && s.setColorCell(e, $.extend(a, {
                amount: o
            })), l ? s.setColorCell(t, $.extend(i, {
                amount: l
            })) : s.clearCell(t), s.raiseEvent("swapCells", [t, e]), this.updateProbabilities(), !0
        }, this.moveColorDeskToWork = function (t) {
            var e = this.jqueryWorkCells(void 0).first();
            if (s.talents.getEffect("palette_smart_dbl_click")) {
                var i = this.sortCellsByTier(this.jqueryWorkCells(null)),
                    a = !1;
                if ($.each(i, function () {
                        if (s.stackCells(t, $(this))) return a = !0, !1
                    }), a) return !1
            }
            if (0 == e.length && s.talents.getEffect("palette_smart_dbl_click") && (e = (i = this.sortCellsByTier(this.jqueryWorkCells(null))).last(), this.jqueryGetTier(t) <= this.jqueryGetTier(e))) return !1;
            this.swapCells(t, e)
        }, this.setActiveCells = function () {
            var t = s.talents.getEffect("paint_cells_active");
            if (t) {
                for (var e = s.jqueryWorkCells(null), i = 0; i < t; i++) e.eq(i).data("activeCell", !0).addClass("active-cell");
                s.subscribeToEvent("onTickTime", function () {
                    s.updateActiveCells()
                })
            }
        }, this.updateActiveCells = function () {
            var t = s.jqueryWorkGrid().find(".grid-cell").filter(function () {
                return $(this).data("activeCell")
            });
            t.length > 0 && $.each(t, function () {
                var t = s.jqueryGetTier($(this)),
                    e = s.sortCellsByTier(s.jqueryDeskCells("color", !0)).first(),
                    i = !1;
                s.jqueryGetTier(e) == t && s.stackCells(e, $(this)) ? i = !1 : s.jqueryGetTier(e) > t && (i = e), i && s.swapCells(i, $(this))
            })
        }, this.moveColorWorkToDesk = function (t) {
            var e = this.jqueryDeskCells(void 0).first();
            "color" == t.data("type") && !t.data("activeCell") && e.length > 0 && (this.setColorCell(this.jqueryDeskCells(void 0).first(), t.data("colorData")), this.clearCell(t))
        }, this.clearCell = function (t) {
            var e = t.data("activeCell");
            t.css({
                "background-color": "inherit",
                color: "inherit"
            }).removeData().removeClass("active").find(".text").text("").end().find(".amount").text("").end().find(".sell").tooltip("dispose"), e && t.data("activeCell", !0)
        }, this.setWorkColorCell = function (t, e) {
            this.setColorCell(this.jqueryWorkGrid().find(".grid-cell").eq(t - 1), e)
        }, this.setDeskColorCell = function (t, e) {
            this.setColorCell(this.jqueryDeskGrid().find(".grid-cell").eq(t - 1), e)
        }, this.setColorCell = function (t, e) {
            var i = t.data("activeCell"),
                s = (e = void 0 === e ? {} : e).tier;
            if ($(t).data({
                    type: "color",
                    colorData: $.extend({
                        amount: 1
                    }, e)
                }), i && $(t).data("activeCell", "active"), void 0 === $(t).data("colorData") || void 0 === $(t).data("colorData").tier) return !1;
            this.setTextColorCell($(t)), this.setColorCss($(t), s)
        }, this.setTextColorCell = function (t) {
            var i = t.data("colorData"),
                a = i.tier;
            t.find(".text").html("层 " + a + "<br />#" + this.decimalToHex(a)).end().find(".sell").attr("title", "出售可以获得 " + e.displayNumber(this.getColorValue(a).times(s.jqueryGetColorAmount(t))) + "$");
            var r = i.amount;
            r > 1 ? t.find(".amount").html(r) : t.find(".amount").html("")
        }, this.setColorCss = function (t, e) {
            var i = "#ffffff",
                s = this.decimalToHex(e),
                a = parseInt(s, 16);
            Math.floor(a % 256 + Math.floor(a / 256) % 256 + Math.floor(a / 65536)) > 384 && (i = "#000000"), t.css({
                "background-color": "#" + s,
                color: i
            }).addClass("active")
        }, this.doGrid = function (t, e) {
            var i = e,
                a = e,
                r = t.find(".grid-cell").length;
            if (r > 0 && r <= e && (e -= r), e + r > 7 && (a = 7), r > 0 && r > i) {
                for (o = i; o < r; o++) t.find(".grid-cell").eq(o - 1).remove();
                e = 0, a = i
            }
            for (var n = 1 / a * 100, o = 0; o < e; o++) {
                var l = $("<div/>").addClass("grid-cell");
                $("<div/>").addClass("text").appendTo(l), $("<div/>").addClass("amount").appendTo(l), $("<div/>").addClass("sell").html('<i class="fa fa-shopping-cart" aria-hidden="true"></i>').appendTo(l), l.appendTo(t), s.jquerySetDraggable(l)
            }
            t.find(".grid-cell").css({
                width: n + "%",
                "padding-top": n + "%"
            })
        }, this.sortWorkColors = function () {
            this.sortColors(this.jqueryWorkGrid())
        }, this.sortDeskColors = function () {
            this.sortColors(this.jqueryDeskGrid())
        }, this.sortCellsByTier = function (t) {
            var e = this;
            return t.sort(function (t, i) {
                var s = e.jqueryGetTier($(t)),
                    a = e.jqueryGetTier($(i));
                return s == a ? e.jqueryGetColorAmount($(i)) - e.jqueryGetColorAmount($(t)) : $(t).data("activeCell") && $(i).data("activeCell") ? a < s ? -1 : 1 : $(t).data("activeCell") ? -1 : a < s ? -1 : 1
            })
        }, this.sortColors = function (t) {
            var e = t.find(".grid-cell");
            this.sortCellsByTier(e), e.detach().appendTo(t)
        }, this.loadOptions = function (t) {
            $.each(t, function (t, e) {
                s.options[t] = e
            }), $("#gallery-show-tier").prop("checked", s.options.galleryShowTier).trigger("change"), $("#color-view").val(s.options.colorView).trigger("change"), $("#change-theme").val(s.options.theme).trigger("change")
        }, this.saveOptions = function () {
            return this.options
        }, this.export = function () {
            var t = this,
                e = {
                    stats: t.statVars.toJson(),
                    time: t.time.toJson(),
                    instruction: t.instruction.toJson(),
                    options: t.saveOptions()
                },
                i = {},
                s = [];
            $.each(t.jqueryWorkCells(null), function () {
                "color" == $(this).data("type") ? s.push({
                    type: "color",
                    colorData: $(this).data("colorData")
                }) : s.push({
                    type: "empty"
                })
            }), i.cells = s, e.workGrid = i;
            var a = {};
            s = [], $.each(t.jqueryDeskCells(null), function () {
                "color" == $(this).data("type") ? s.push({
                    type: "color",
                    colorData: $(this).data("colorData")
                }) : s.push({
                    type: "empty"
                })
            }), a.cells = s, e.deskGrid = a;
            var r = {};
            $.each(t.upgrades.upgrades, function (t, e) {
                r[e.name] = e.level
            }), e.upgrades = r;
            var n = {};
            return $.each(t.talents.talents, function (t, e) {
                n[e.name] = {
                    level: e.level,
                    trialLevel: e.trialLevel
                }
            }), e.talents = n, Base64.encode(JSON.stringify(e))
        }, this.import = function (t) {
            0 == t.length && alert("Import cannot be empty"), this.clear();
            var e = this;
            t = Base64.decode(t);
            var i = JSON.parse(t);
            this.statVars.fromJson(i.stats), this.time.fromJson(i.time), this.instruction.fromJson(i.instruction), $.each(i.upgrades, function (t, i) {
                var s = e.upgrades.getByName(t);
                s.level = i, s.hasOwnProperty("upgrade") && s.upgrade(), e.upgrades.updateText(s)
            }), $.each(i.talents, function (t, i) {
                var s = e.talents.getByName(t);
                s && (s.level = i.level, s.trialLevel = i.trialLevel)
            }), e.talents.updateAllTexts(), e.doWorkGrid(), $.each(i.workGrid.cells, function (t, i) {
                "color" == i.type && e.setWorkColorCell(t + 1, i.colorData)
            }), e.doDeskGrid(), $.each(i.deskGrid.cells, function (t, i) {
                "color" == i.type && e.setDeskColorCell(t + 1, i.colorData)
            }), this.setEvents(), this.loadOptions(i.options), this.updateProbabilities(), this.setActiveCells(), e.statVars.setButtons()
        }, this.saveGame = function () {
            var t = this.export();
            localStorage.setItem("game", t)
        }, this.isLoadGame = function () {
            if (localStorage.getItem("game")) return !0
        }, this.loadGame = function () {
            var t = localStorage.getItem("game");
            if (t) return this.import(t), !0
        }, this.deleteSave = function () {
            localStorage.removeItem("game"), this.autoSave = !1
        }, this.autoSave = function () {
            var t = this;
            setInterval(function () {
                t.autoSave && t.saveGame()
            }, 1e4)
        }, this.subscribeToEvent = function (t, e) {
            this.events.hasOwnProperty(t) || (this.events[t] = []), this.events[t].push(e)
        }, this.raiseEvent = function (t, e) {
            t = "on" + t.charAt(0).toUpperCase() + t.slice(1), this.events.hasOwnProperty(t) && $.each(this.events[t], function (t, i) {
                i.apply(this, e || [])
            })
        }
    }

    function a(t) {
        var i = this;
        this.game = t, this.init = function () {
            this.game.subscribeToEvent("onMoneyChange", function () {
                i.updateAllTexts()
            }), this.setTextUpgrades(), this.setEvents()
        }, this.upgrades = [{
            title: '<i class="fa fa-clock-o" aria-hidden="true"></i> 时间',
            name: "time",
            level: 0,
            multi: 1,
            cost: function () {
                var t = i.getCost(this.level, this.multi, function (t) {
                    return new BigNumber(2).pow(t).times(400)
                });
                return this.multi = t.multi, t.sum
            },
            effect: function () {
                return Math.pow(.95, this.level)
            },
            description: function () {
                return "每一级可以减少5％时间，最低限制为3秒"
            },
            upgrade: function () {
                i.game.statVars.updateTick()
            }
        }, {
            title: '<i class="fa fa-percent" aria-hidden="true"></i> 几率',
            name: "chance",
            level: 0,
            multi: 1,
            cost: function () {
                var t = i.getCost(this.level, this.multi, function (t) {
                    return new BigNumber(1.15).pow(t).times(400)
                });
                return this.multi = t.multi, t.sum
            },
            effect: function () {
                return Math.pow(1.05, this.level)
            },
            description: function () {
                return "提高5％得到的颜色的几率"
            },
            upgrade: function () {
                i.game.updateProbabilities()
            }
        }, {
            title: '<i class="fa fa-money" aria-hidden="true"></i> 金钱',
            name: "money",
            level: 0,
            multi: 1,
            cost: function () {
                var t = i.getCost(this.level, this.multi, function (t) {
                    return new BigNumber(1.12).pow(t).times(400)
                });
                return this.multi = t.multi, t.sum
            },
            effect: function () {
                return Math.pow(1.05, this.level)
            },
            description: function () {
                return "增加销售颜色的金额5％"
            }
        }], this.getCost = function (t, e, s) {
            if (e) var a = t + e;
            for (var r = new BigNumber(0), n = t; new BigNumber(r).plus(s(n)).lessThanOrEqualTo(i.game.statVars.money) && (!a || a > n);) r = new BigNumber(r).plus(s(n)), n++;
            return r.lessThanOrEqualTo(0) && (r = new BigNumber(r).plus(s(t))), {
                sum: r,
                multi: n - t
            }
        }, this.setEvents = function () {
            $.each(this.upgrades, function (t, e) {
                $("#upgrade-" + e.name).click(function () {
                    if (i.isEnoughMoney(e)) {
                        var t = e.cost();
                        e.level += e.multi, i.game.statVars.money = i.game.statVars.money.minus(t), i.updateText(e), e.hasOwnProperty("upgrade") && e.upgrade()
                    }
                })
            }), $("#upgrade-multi-buttons button").click(function () {
                $(this).siblings().removeClass("active"), $(this).addClass("active");
                var t = $(this);
                $.each(i.upgrades, function (e, s) {
                    s.multi = t.data("multi"), i.updateText(s)
                })
            })
        }, this.updateAllTexts = function () {
            $.each(this.upgrades, function (t, e) {
                i.updateText(e)
            })
        }, this.updateText = function (t) {
            var i = $("#upgrade-" + t.name + " button"),
                s = $("#upgrade-multi-buttons button.active");
            t.multi = s.data("multi");
            var a = t.cost();
            t.multi ? i.removeClass("disabled") : i.addClass("disabled");
            var r = "";
            t.multi && (r = " (+" + t.multi + ")"), i.html(t.title + "<br /> 等级 " + t.level + r + "<br /> " + e.displayNumber(a) + "$")
        }, this.isEnoughMoney = function (t) {
            return t.cost().lessThanOrEqualTo(i.game.statVars.money)
        }, this.setTextUpgrades = function () {
            $("upgrades").empty(), $.each(this.upgrades, function (t, i) {
                var s = $("<div/>").addClass("upgrade col-md-4").attr("id", "upgrade-" + i.name).attr("data-toggle", "tooltip").attr("title", i.description);
                $("<button/>").addClass("btn btn-primary cost").html(i.title + "<br /> 等级 " + i.level + " <br /> " + e.displayNumber(i.cost()) + "$").appendTo(s);
                s.appendTo("#upgrades")
            })
        }, this.getByName = function (t) {
            switch (t) {
                case "time":
                    return this.upgrades[0];
                case "chance":
                    return this.upgrades[1];
                case "money":
                    return this.upgrades[2]
            }
        }, this.getEffect = function (t) {
            return this.getByName(t).effect()
        }, this.clear = function () {
            $.each(this.upgrades, function (t, e) {
                e.level = 0
            }), i.game.statVars.updateTick()
        }
    }

    function r(t) {
        this.game = t;
        var e = this;
        this.talents = [{
            name: "paint_cells_count",
            title: "画板单元格",
            description: '增加“画板”中的单元格数量',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            effect: function (t) {
                return 1 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "增加单元格的数量 " + this.effect(this.getLevel())
            },
            nextLevelDescription: function () {
                return "增加单元格的数量 " + this.effect(this.getLevel() + 1)
            },
            cost: function () {
                return 2
            },
            upgrade: function () {
                e.game.doWorkGrid()
            }
        }, {
            name: "paint_cells_stack",
            title: "画板堆栈",
            description: '同一层的“画板”中的颜色可以堆叠在一个单元格中',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            available: [{
                name: "paint_cells_count",
                every: 4
            }],
            effect: function (t) {
                return 1 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "增加一个单元格中的颜色数量 " + this.effect(this.getLevel())
            },
            nextLevelDescription: function () {
                return "增加一个单元格中的颜色数量 " + this.effect(this.getLevel() + 1)
            },
            cost: function () {
                return 5
            }
        }, {
            name: "paint_cells_active",
            title: "绘制活动",
            description: '“绘画”中的单元格变为活动状态，它将自动移动“托盘”中的最佳颜色，',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            available: [{
                name: "paint_cells_stack",
                every: 4
            }],
            effect: function (t) {
                return 1 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "增加活动单元格 " + this.effect(this.getLevel())
            },
            nextLevelDescription: function () {
                return "增加活动单元格 " + this.effect(this.getLevel() + 1)
            },
            cost: function () {
                return 10
            },
            upgrade: function () {
                e.game.setActiveCells()
            }
        }, {
            name: "paint_tier_same",
            title: "颜色层相同",
            description: '在“画板”每个同一层给出更高的概率',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            available: [{
                name: "paint_cells_count",
                every: 4
            }],
            effect: function (t) {
                return 1.5 + .1 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "增加相同层的概率 " + Math.floor(100 * (this.effect(this.getLevel()) - 1)) + "%"
            },
            nextLevelDescription: function () {
                return "增加相同层的概率 " + Math.floor(100 * (this.effect(this.getLevel() + 1) - 1)) + "%"
            },
            cost: function () {
                return 5
            },
            upgrade: function () {
                e.game.setActiveCells()
            }
        }, {
            name: "paint_auto_sort",
            title: "自动排序",
            description: '“画板”中的单元格将被自动分类（替换，交换等），还添加了一个按钮，您可以打开或关闭自动排序',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            maxLevel: 1,
            available: [{
                name: "paint_cells_count",
                at: 5
            }],
            effect: function () {
                return this.getLevel()
            },
            cost: function () {
                return 15
            },
            upgrade: function () {
                e.game.statVars.setButtons()
            }
        }, {
            name: "palette_cells_count",
            title: "调色板单元格",
            description: '增加“调色板”中的单元格数量',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            effect: function (t) {
                return 1 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "增加单元格的数量 " + this.effect(this.getLevel())
            },
            nextLevelDescription: function () {
                return "增加单元格的数量 " + this.effect(this.getLevel() + 1)
            },
            cost: function () {
                return 2
            },
            upgrade: function () {
                e.game.doDeskGrid()
            }
        }, {
            name: "palette_smart_dbl_click",
            title: "智能dblclk",
            description: '如果可能的话，双击“调色板”中的颜色，用最差的颜色替换它',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            maxLevel: 1,
            available: [{
                name: "palette_cells_count",
                at: 5
            }, {
                name: "paint_auto_sort",
                at: 1
            }],
            effect: function () {
                return this.getLevel()
            },
            cost: function () {
                return 10
            }
        }, {
            name: "palette_auto_sort",
            title: "自动排序",
            description: '“调色板”中的单元格将被自动排序（当被替换，交换，打勾等）时，还添加了一个按钮，您可以打开或关闭自动排序',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            maxLevel: 1,
            available: [{
                name: "auto_seller_smart",
                at: 1
            }],
            effect: function () {
                return this.getLevel()
            },
            cost: function () {
                return 10
            },
            upgrade: function () {
                e.game.statVars.setButtons()
            }
        }, {
            name: "auto_seller_smart",
            title: "智能卖家",
            description: '“智能卖家”将卖掉最差的颜色',
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            maxLevel: 1,
            available: [{
                name: "palette_cells_count",
                at: 5
            }],
            effect: function () {
                return this.getLevel()
            },
            cost: function () {
                return 10
            }
        }, {
            name: "probability",
            title: "几率",
            description: "增加获得颜色的机率",
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            effect: function (t) {
                return 1 + .1 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "增加机率 " + Math.floor(100 * this.effect(this.getLevel())) + "%"
            },
            nextLevelDescription: function () {
                return "增加机率 " + Math.floor(100 * this.effect(this.getLevel() + 1)) + "%"
            },
            cost: function () {
                return 2
            },
            upgrade: function () {
                e.game.updateProbabilities()
            }
        }, {
            name: "base_color",
            title: "基本颜色",
            description: "重置后，您将获得更高层次的颜色",
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            available: [{
                name: "probability",
                every: 4
            }],
            effect: function (t) {
                return 2 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "你得到一个层的颜色 " + this.effect(this.getLevel())
            },
            nextLevelDescription: function () {
                return "你得到一个层的颜色 " + this.effect(this.getLevel() + 1)
            },
            cost: function () {
                return 1
            }
        }, {
            name: "tick_color_count",
            title: "勾选颜色",
            description: "每个计时器滴答给出更多的颜色",
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            available: [{
                name: "base_color",
                every: 4
            }],
            effect: function (t) {
                return 1 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "你得到了 " + this.effect(this.getLevel()) + " 颜色 "
            },
            nextLevelDescription: function () {
                return "你得到了 " + this.effect(this.getLevel() + 1) + " 颜色 "
            },
            cost: function () {
                return 10
            }
        }, {
            name: "color_tier_count",
            title: "颜色层",
            description: "颜色的效果会更大。 也就是说，如果你在油漆中有10级颜色，那么你可以把颜色降到最多11，用这个天赋你可以得到12级以上",
            level: 0,
            trialLevel: 0,
            getLevel: function () {
                return parseInt(this.level + this.trialLevel)
            },
            available: [{
                name: "probability",
                every: 4
            }],
            effect: function (t) {
                return 1 * (t = void 0 === t ? this.level : t)
            },
            currentLevelDescription: function () {
                return "增加效果 " + this.effect(this.getLevel()) + " 层"
            },
            nextLevelDescription: function () {
                return "增加效果 " + this.effect(this.getLevel() + 1) + " 层"
            },
            cost: function () {
                return 10
            },
            upgrade: function () {
                e.game.updateProbabilities()
            }
        }], this.init = function () {
            this.updateAllTexts(), this.setEvents()
        }, this.setEvents = function () {
            this.game.subscribeToEvent("onGoldPaintChange", function () {
                e.updateAllTexts()
            }), $("#reset-talents").click(function () {
                var t = e.getAllCost();
                t > 0 && confirmModal({
                    content: "你会得到退回的 " + t + " 金漆。 <br /> 你确定？",
                    confirmCallback: function () {
                        e.reset()
                    }
                })
            }), $.each(this.talents, function (t, i) {
                $('#talents button[data-name="' + i.name + '"]').click(function () {
                    var t = i.cost();
                    e.canUpgrade(i) && (e.game.statVars.goldPaint = new BigNumber(e.game.statVars.goldPaint).minus(t), i.trialLevel += 1, $("#talents .cancel-confirm-buttons").show(), e.updateAllTexts(), $(this).tooltip("show"))
                })
            }), $("#cancel-talents").click(function () {
                var t = 0;
                $.each(e.talents, function (i, s) {
                    t += s.trialLevel * s.cost(), s.trialLevel = 0, e.updateText(s)
                }), e.game.statVars.goldPaint = e.game.statVars.goldPaint.plus(t), $("#talents .cancel-confirm-buttons").hide()
            }), $("#confirm-talents").click(function () {
                e.confirm()
            }), $("#main-menu a").click(function () {
                if ($("#talents").is(":visible") && $("#talents .cancel-confirm-buttons").is(":visible")) return confirmModal({
                    content: "你没有保存你的天赋。 <br /> 是否保存?",
                    confirmButtonText: "保存",
                    confirmCallback: function () {
                        e.confirm()
                    }
                }), !1
            })
        }, this.confirm = function () {
            $.each(e.talents, function (t, i) {
                i.trialLevel && (i.level = i.level + i.trialLevel, i.trialLevel = 0, e.updateText(i), i.hasOwnProperty("upgrade") && i.upgrade())
            }), $("#talents .cancel-confirm-buttons").hide()
        }, this.reset = function () {
            var t = e.game.statVars.resetCount > 0;
            e.game.statVars.goldPaint = e.game.statVars.goldPaint.plus(e.getAllCost()), $.each(e.talents, function (i, s) {
                var a = 0;
                "paint_cells_active" == s.name && t && (a = 1), s.level = a, s.hasOwnProperty("upgrade") && s.upgrade(), e.updateText(s)
            })
        }, this.getAllCost = function () {
            var t = e.game.statVars.resetCount > 0,
                i = 0;
            return $.each(e.talents, function (e, s) {
                var a = s.level;
                "paint_cells_active" == s.name && t && (a -= 1), i += a * s.cost()
            }), Math.floor(1 * i)
        }, this.updateAllTexts = function () {
            $.each(e.talents, function (t, i) {
                i.trialLevel && $("#talents .cancel-confirm-buttons").show(), e.updateText(i)
            })
        }, this.updateText = function (t) {
            var i = $('#talents button[data-name="' + t.name + '"]');
            i.html(t.title), e.canUpgrade(t) ? i.removeClass("disabled") : i.addClass("disabled"), t.getLevel() > 0 && i.html(i.html() + " (" + t.getLevel() + ")");
            var s = "<div><b>描述:</b> " + t.description + "</div>";
            t.hasOwnProperty("currentLevelDescription") && (s += "<div><b>当前等级:</b> " + t.currentLevelDescription() + "</div>"), t.hasOwnProperty("nextLevelDescription") && (s += "<div><b>下一级:</b> " + t.nextLevelDescription() + "</div>"), t.hasOwnProperty("available") && (s += "<div><b>前置条件:</b> " + e.getTextAvailable(t)), t.hasOwnProperty("maxLevel") && (s += "<div><b>最高等级:</b> " + t.maxLevel), s += "<div><b>花费:</b> " + t.cost() + " 金漆</div>", i.tooltip("dispose"), i.attr("data-original-title", s), i.tooltip({
                trigger: "hover",
                html: !0
            })
        }, this.getTextAvailable = function (t) {
            var i = [],
                s = "需要",
                a = 0;
            return $.each(t.available, function (t, r) {
                a = r.every, r.at && (s = "需要", a = r.at), i.push(s + " " + a + ' 级 "' + e.getTitle(r.name) + '"')
            }), i.join(", ")
        }, this.getByName = function (t) {
            switch (t) {
                case "paint_cells_count":
                    return this.talents[0];
                case "paint_cells_stack":
                    return this.talents[1];
                case "paint_cells_active":
                    return this.talents[2];
                case "paint_tier_same":
                    return this.talents[3];
                case "paint_auto_sort":
                    return this.talents[4];
                case "palette_cells_count":
                    return this.talents[5];
                case "palette_smart_dbl_click":
                    return this.talents[6];
                case "palette_auto_sort":
                    return this.talents[7];
                case "auto_seller_smart":
                    return this.talents[8];
                case "probability":
                    return this.talents[9];
                case "base_color":
                    return this.talents[10];
                case "tick_color_count":
                    return this.talents[11];
                case "color_tier_count":
                    return this.talents[12]
            }
        }, this.getTitle = function (t) {
            return e.getByName(t).title
        }, this.getEffect = function (t) {
            return e.getByName(t).effect()
        }, this.canUpgrade = function (t) {
            var i = t.cost() <= e.game.statVars.goldPaint;
            if (t.hasOwnProperty("maxLevel")) s = t.getLevel() < t.maxLevel;
            else var s = !0;
            return i && s && e.isAvailable(t)
        }, this.isAvailable = function (t) {
            var i = t.available,
                s = !0;
            return i ? ($.each(i, function (i, a) {
                var r = e.getByName(a.name),
                    n = parseInt(r.level + r.trialLevel),
                    o = parseInt(t.level + t.trialLevel);
                if (a.hasOwnProperty("at")) {
                    l = a.at;
                    s = s && n >= l
                }
                if (a.hasOwnProperty("every")) {
                    var l = a.every;
                    s = s && Math.floor(n / l) > o
                }
            }), s) : s
        }
    }

    function n(t) {
        this.game = t;
        var i = this;
        this.highestTier = 0, this.init = function () {
            this.setEvents(), i.game.statVars.highestTier ? this.highestTier = i.game.statVars.highestTier : this.highestTier = 0
        }, this.updateText = function () {
            $("#gallery #highest-tier").text(i.game.statVars.highestTier), $("#gallery #max-tier").text(i.game.statVars.getMaxTier()), $("#new-tier").text(""), i.highestTier = i.game.statVars.highestTier
        }, this.setEvents = function () {
            $(document).on("click", "#main-menu .nav-item a", function () {
                $("#gallery ul").empty(), $("#gallery .tab-content").empty(), "#gallery" == $(this).attr("href") && (i.generateTabs(), i.updateText())
            }), $(document).on("click", "#gallery-menu .nav-item a", function () {
                var t = $(this).data("id");
                $("#gallery .tab-content .tab-pane").empty(), i.generateColors(t)
            }), $(document).on("click", "#gallery .color", function () {
                var t = $(this).data("id"),
                    s = "<div>层: " + t + "</div>";
                s += "<div>颜色值: #" + i.game.decimalToHex(t) + "</div>", s += "<div>货币价值: " + e.displayNumber(i.game.getColorValueWithoutExtra(t)) + "</div>", s += "<div>概率成本: " + e.displayNumber(i.game.getProbCostWithoutExtra(t)) + "</div>", s += "<div>概率值: " + e.displayNumber(i.game.getProbValueWithoutExtra(t)) + "</div>", $(this).attr("title", s).tooltip({
                    html: !0
                }).tooltip("show")
            }), $("#gallery-show-tier").change(function () {
                $(this).prop("checked") ? $("#gallery .color .text").show() : $("#gallery .color .text").hide(), i.game.options.galleryShowTier = $(this).prop("checked")
            }), i.game.subscribeToEvent("onHighestTierChange", function () {
                i.game.statVars.highestTier > i.highestTier && $("#new-tier").text(i.game.statVars.highestTier - i.highestTier)
            })
        }, this.generateTabs = function () {
            var t = i.game.statVars.highestTier,
                e = i.getCountColorsInTab(),
                s = Math.ceil(t / e);
            0 == s && (s = 1);
            for (var a = 0; a < s; a++) {
                var r = $("<li/>").addClass("nav-item"),
                    n = a * (e + 1),
                    o = n + e;
                $("<a/>").addClass("nav-link").attr("data-tab", "true").attr("href", "#gallery-tab-" + a).attr("data-id", a).html(n + " - " + o).appendTo(r);
                r.appendTo("#gallery .nav");
                $("<div/>").addClass("tab-pane clearfix").attr("id", "gallery-tab-" + a).appendTo("#gallery .tab-content")
            }
        }, this.getCountColorsInTab = function () {
            return 1023
        }, this.generateColors = function (t) {
            var e = this.getCountColorsInTab(),
                s = i.game.statVars.highestTier,
                a = t * (e + 1),
                r = a + e;
            r > s && (r = s);
            for (var n = $("#gallery .tab-content #gallery-tab-" + t), o = a; o <= r; o++) {
                var l = $("<div/>").addClass("color").attr("data-id", o);
                i.game.setColorCss(l, o);
                var c = $("<div/>").addClass("text").text(o).appendTo(l);
                $("#gallery-show-tier").prop("checked") || c.hide(), l.appendTo(n)
            }
        }
    }
    Object.defineProperty(e.prototype, "money", {
        set: function (t) {
            this._money = new BigNumber(t), this.game.raiseEvent("moneyChange"), this.setTextMoney()
        },
        get: function () {
            return this._money
        }
    }), Object.defineProperty(e.prototype, "allMoney", {
        set: function (t) {
            this._allMoney = new BigNumber(t), this.game.raiseEvent("allMoneyChange"), this.setTextAllMoney()
        },
        get: function () {
            return this._allMoney
        }
    }), Object.defineProperty(e.prototype, "goldPaint", {
        set: function (t) {
            this._goldPaint = new BigNumber(t), this.game.raiseEvent("goldPaintChange"), this.setTextGoldPaint()
        },
        get: function () {
            return this._goldPaint
        }
    }), Object.defineProperty(e.prototype, "allGoldPaint", {
        set: function (t) {
            this._allGoldPaint = new BigNumber(t), this.game.raiseEvent("allGoldPaintChange"), this.setTextAllGoldPaint(), this.toKongStat("Gold paint collected", this._allGoldPaint)
        },
        get: function () {
            return this._allGoldPaint
        }
    }), Object.defineProperty(e.prototype, "highestTier", {
        set: function (t) {
            var e = this._highestTier;
            this._highestTier = t, this.getHighestTierThisReset() > 0 && Math.floor(t / 100) > Math.floor(e / 100) && (this.bonusGoldPaint = parseInt(parseInt(this.bonusGoldPaint) + 10 * Math.floor(t / 100)), this.setTextGoldPaint()), this.game.raiseEvent("highestTierChange", [e, t]), this.setTextGoldPaint(), this.setTextHighestTier(), this.toKongStat("Highest tier", this._highestTier)
        },
        get: function () {
            return this._highestTier
        }
    }), Object.defineProperty(e.prototype, "resetCount", {
        set: function (t) {
            var e = this._resetCount;
            this._resetCount = new BigNumber(t), this.game.raiseEvent("resetCountChange", [e, t]), this.setTextResetCount()
        },
        get: function () {
            return this._resetCount
        }
    }), Object.defineProperty(s.prototype, "probabilities", {
        set: function (t) {
            this._probabilities = t, this.raiseEvent("probabilitiesChange"), this.setTextProbabilities()
        },
        get: function () {
            return this._probabilities
        }
    }), e.displayNumber = function (t) {
        var e = (t = new BigNumber(t)).e;
        return e > 5 || e < -2 ? t.toExponential(2) : e < 0 && e >= -2 ? t.toFixed(Math.abs(e)) : e <= 0 ? parseFloat(t.toFixed(2)) : Math.floor(t)
    };
    var o = new s;
    o.start(), $(document).on("click", "#main-menu a", function () {
        "#gallery" == $(this).attr("href") && o.instruction.start("gallery"), "#talents" == $(this).attr("href") && o.instruction.start("talents")
    })
}), $(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: "hover"
    })
}), window.onmessage = function (t) {
    "getGame" == t.data && console.log(localStorage.getItem("game"))
};
//kongregateAPI.loadAPI(function(){window.kongregate=kongregateAPI.getAPI()}),
